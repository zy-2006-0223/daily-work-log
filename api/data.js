// 数据存储API - 使用GitHub存储数据
// 数据存在仓库的 data.json 文件中
// GitHub Token 通过 Vercel 环境变量 GITHUB_TOKEN 传入

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = 'zy-2006-0223';
const REPO_NAME = 'daily-work-log';
const FILE_PATH = 'data.json';
const API_URL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;

export default async function handler(req, res) {
  // 设置CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      const response = await fetch(API_URL, {
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const content = Buffer.from(data.content, 'base64').toString('utf-8');
        return res.status(200).json(JSON.parse(content));
      }

      // 文件不存在，返回默认数据
      if (response.status === 404) {
        const defaultData = {
          tasks: {},
          reviews: {},
          habits: [],
          weeklyReviews: {},
          top3: {},
        };
        return res.status(200).json(defaultData);
      }

      return res.status(response.status).json({ error: 'GitHub API error' });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const newData = req.body;
      const content = Buffer.from(JSON.stringify(newData, null, 2)).toString('base64');

      // 先获取当前文件的信息（用于获取sha）
      const getResponse = await fetch(API_URL, {
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      });

      let sha = null;
      if (getResponse.ok) {
        const existing = await getResponse.json();
        sha = existing.sha;
      }

      // 创建或更新文件
      const body = {
        message: 'sync data',
        content: content,
        branch: 'master',
      };
      if (sha) body.sha = sha;

      const putResponse = await fetch(API_URL, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (putResponse.ok) {
        return res.status(200).json({ success: true });
      }

      const errText = await putResponse.text();
      return res.status(putResponse.status).json({ error: 'Save failed: ' + errText });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}