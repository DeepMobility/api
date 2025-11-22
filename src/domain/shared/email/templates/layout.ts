export const emailLayout = {
  html: (content: string) => `
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #2c2c2c;
            margin: 0;
            padding: 0;
            background-color: #f8f8f8;
          }
          .email-wrapper {
            width: 100%;
            background-color: #f8f8f8;
            padding: 40px 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          }
          .header {
            background-color: #2c2c2c;
            padding: 30px 30px;
            text-align: center;
          }
          .logo {
            width: 140px;
            height: auto;
            display: block;
            margin: 0 auto;
          }
          .content {
            padding: 40px 30px;
            background-color: #ffffff;
          }
          .content h2 {
            color: #1a1a1a;
            font-size: 22px;
            font-weight: 600;
            margin: 0 0 20px 0;
            letter-spacing: -0.3px;
          }
          .content p {
            margin: 0 0 16px 0;
            color: #4a4a4a;
            font-size: 15px;
            line-height: 1.6;
          }
          .button-container {
            text-align: center;
            margin: 30px 0 20px;
          }
          .button {
            display: inline-block;
            background-color: #816dfc;
            color: #ffffff !important;
            padding: 14px 32px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            font-size: 15px;
            letter-spacing: 0.2px;
          }
          .note {
            font-size: 13px;
            color: #888888;
            margin-top: 20px;
            line-height: 1.5;
          }
          .footer {
            background-color: #fafafa;
            padding: 25px 30px;
            text-align: center;
            border-top: 1px solid #efefef;
          }
          .footer-text {
            font-size: 12px;
            color: #999999;
            line-height: 1.5;
          }
          @media only screen and (max-width: 600px) {
            .email-wrapper {
              padding: 20px 10px;
            }
            .header {
              padding: 25px 20px;
            }
            .content {
              padding: 30px 20px;
            }
            .footer {
              padding: 20px 15px;
            }
            .logo {
              width: 120px;
            }
            .content h2 {
              font-size: 20px;
            }
            .button {
              padding: 12px 28px;
              font-size: 14px;
            }
          }
        </style>
      </head>
      <body>
        <div class="email-wrapper">
          <div class="container">
            <div class="header">
              <img src="https://ik.imagekit.io/deepmobilitybis/logo-blanc.png" alt="DeepMobility" class="logo" />
            </div>
            <div class="content">
              ${content}
            </div>
            <div class="footer">
              <div class="footer-text">
                L'équipe DeepMobility
              </div>
              <div class="footer-text" style="margin-top: 8px; color: #b3b3b3;">
                Cet email a été envoyé automatiquement, merci de ne pas y répondre.
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  `,
  text: (content: string) => content,
};

