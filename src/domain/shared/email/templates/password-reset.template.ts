import { emailLayout } from './layout';

const content = `
  <h2>{{t.greeting}}</h2>
  <p>{{t.instruction}}</p>
  <div class="button-container">
    <a href="{{resetUrl}}" class="button">{{t.buttonText}}</a>
  </div>
  <p class="note">{{t.validityNote}}</p>
  <p class="note" style="margin-top: 8px;">{{t.notRequested}}</p>
`;

export const passwordResetTemplate = {
  html: emailLayout.html(content),
  text: emailLayout.text(`
{{t.greeting}}

{{t.instruction}}

{{resetUrl}}

{{t.validityNote}}

{{t.notRequested}}

L'équipe DeepMobility
  `),
};

