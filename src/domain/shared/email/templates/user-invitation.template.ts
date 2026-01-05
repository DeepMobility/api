import { emailLayout } from './layout';

const content = `
  <h2>{{t.greeting}}</h2>
  <p>{{t.intro}}{{accountName}}{{t.intro2}}</p>
  <p>{{t.instruction}}</p>
  <div class="button-container">
    <a href="{{invitationUrl}}" class="button">{{t.buttonText}}</a>
  </div>
  <p class="note">{{t.validityNote}}</p>
  <p class="note">{{t.benefits}}</p>
`;

export const userInvitationTemplate = {
  html: emailLayout.html(content),
  text: emailLayout.text(`
{{t.greeting}}

{{t.intro}}{{accountName}}{{t.intro2}}

{{t.instruction}}

{{invitationUrl}}

{{t.validityNote}}
{{t.benefits}}

L'équipe DeepMobility
  `),
};

