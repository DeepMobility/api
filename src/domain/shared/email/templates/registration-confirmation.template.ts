import { emailLayout } from './layout';

const content = `
  <h2>{{t.greeting}}{{firstName}}</h2>
  <p>{{t.welcome}}</p>
  <p>{{t.instruction}}</p>
  <div class="button-container">
    <a href="{{confirmationUrl}}" class="button">{{t.buttonText}}</a>
  </div>
  <p class="note">{{t.validityNote}}</p>
`;

export const registrationConfirmationTemplate = {
  html: emailLayout.html(content),
  text: emailLayout.text(`
{{t.greeting}}{{firstName}}

{{t.welcome}}

{{t.instruction}}

{{confirmationUrl}}

{{t.validityNote}}

L'équipe DeepMobility
  `),
};

