# CF Pages 网站提速代理

这个项目是基于 Cloudflare Pages Functions 的网站代理加速工具，灵感来自 [@jc-lw/cloudflare-wangzhantisu](https://github.com/jc-lw/cloudflare-wangzhantisu)。通过 Cloudflare Pages 部署，实现了更灵活的域名管理和自动化部署。

## 特点

- 使用 Cloudflare Pages 部署，自带 `*.pages.dev` 域名
- 支持自定义域名绑定
- 使用 TypeScript 开发，类型安全
- 配置灵活，通过环境变量控制目标域名
- 自动构建和部署，零维护成本
- 不消耗 Workers 配额

## 部署步骤

1. **Fork 或克隆此仓库**
   - 直接 Fork 此仓库到你的 GitHub 账号下
   - 或者下载代码后创建新仓库上传

2. **在 Cloudflare Pages 中部署**
   - 登录 Cloudflare Dashboard
   - 转到 Pages 面板，点击 "Create a project"
   - 连接你的 GitHub 仓库
   - 构建设置：
     - 构建命令：`npm install`
     - 输出目录：`/`
     - 框架预设：None

3. **配置环境变量**
   - 在项目设置中找到 "Environment variables"
   - 添加变量：
     - 变量名：`TARGET_HOSTNAME`
     - 值：目标域名（例如：`api.github.com`）
   - 可以为不同环境（预览/生产）设置不同的目标域名

4. **（可选）绑定自定义域名**
   - 在项目的 "Custom domains" 中添加你的域名
   - 按照提示配置 DNS 记录
   - 等待 SSL 证书自动配置完成

## 项目结构
.
├── functions/
│ ├── middleware.ts # 代理逻辑实现
│ └── routes.json # 路由规则配置
├── .gitignore # Git 忽略文件配置
├── package.json # 项目依赖配置
├── tsconfig.json # TypeScript 配置
└── README.md # 项目说明文档
```

## 工作原理

项目通过 Cloudflare Pages Functions 的中间件功能实现请求代理：

1. 接收请求：当用户访问你的 Pages 域名时，请求首先到达 Cloudflare 边缘节点
2. 处理请求：`_middleware.ts` 接收请求并保持原始的：
   - HTTP 方法（GET、POST 等）
   - 请求头部
   - 请求体（对于 POST 等请求）
3. 转发请求：将请求转发到 `TARGET_HOSTNAME` 指定的目标服务器
4. 返回响应：将目标服务器的响应返回给用户

## 优势

- **零成本部署**：完全免费，不消耗 Workers 配额
- **简单配置**：仅需设置一个环境变量
- **自动化部署**：推送代码自动触发部署
- **灵活域名**：支持 Pages 自带域名和自定义域名
- **类型安全**：TypeScript 开发，提供类型检查
- **零维护**：Cloudflare 负责运维和更新

## 使用场景

- 为国外网站创建国内镜像
- 为静态网站提供 CDN 加速
- 作为简单的反向代理使用
- 为不支持 HTTPS 的站点添加 SSL

## 常见问题

1. **如何更新目标域名？**
   - 在 Pages 项目设置中修改 `TARGET_HOSTNAME` 环境变量即可

2. **支持哪些 HTTP 方法？**
   - 支持所有标准 HTTP 方法（GET、POST、PUT、DELETE 等）

3. **如何处理 CORS？**
   - Pages Functions 会自动处理跨域请求

4. **如何查看访问日志？**
   - 在 Cloudflare Pages 的 "Analytics" 标签页查看

## 注意事项

- 确保目标域名支持被代理访问
- 注意遵守目标网站的使用条款
- 建议配置访问控制措施
- 不要代理敏感信息

## 许可证

MIT License

## 致谢

感谢 [@jc-lw](https://github.com/jc-lw) 的原始项目提供灵感。这个项目是在其基础上，将部署方式改为 Cloudflare Pages，使域名管理更加灵活。

## 贡献指南

欢迎通过以下方式贡献：
- 提交 Issue 报告问题
- 提交 Pull Request 改进代码
- 完善文档内容
- 分享使用经验

## 更新日志

### v1.0.0
- 初始版本发布
- 基本代理功能实现
- 支持环境变量配置
