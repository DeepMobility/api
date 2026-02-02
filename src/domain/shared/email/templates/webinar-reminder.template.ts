import { emailLayout } from './layout';

const content = `
  <h2>{{t.greeting}}</h2>
  <p>{{t.intro}}</p>
  <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <h3 style="margin: 0 0 10px 0; color: #1a73e8;">{{webinarTitle}}</h3>
    <p style="margin: 0; color: #5f6368;">📅 {{webinarDate}}</p>
  </div>
  <p>{{t.instruction}}</p>
  <div class="button-container">
    <a href="{{webinarLink}}" class="button">{{t.buttonText}}</a>
  </div>
  <p class="note">{{t.note}}</p>
`;

export const webinarReminderTemplate = {
  html: emailLayout.html(content),
  text: emailLayout.text(`
{{t.greeting}}

{{t.intro}}

{{webinarTitle}}
📅 {{webinarDate}}

{{t.instruction}}

{{webinarLink}}

{{t.note}}

L'équipe DeepMobility
  `),
};
