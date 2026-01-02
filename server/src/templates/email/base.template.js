export const baseEmailTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    body {
      background-color: #f4f6f8;
      font-family: Arial, sans-serif;
      padding: 20px;
    }
    .container {
      max-width: 520px;
      margin: auto;
      background: #ffffff;
      border-radius: 8px;
      padding: 24px;
    }
    .header {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 16px;
      color: #111827;
    }
    .content {
      font-size: 14px;
      color: #374151;
      line-height: 1.6;
    }
    .button {
      display: inline-block;
      margin-top: 20px;
      padding: 12px 20px;
      background-color: #2563eb;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
    }
    .footer {
      margin-top: 32px;
      font-size: 12px;
      color: #6b7280;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    ${content}
    <div class="footer">
      © ${new Date().getFullYear()} PMS App. All rights reserved.
    </div>
  </div>
</body>
</html>
`;
