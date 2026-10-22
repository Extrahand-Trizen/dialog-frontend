import { Link } from 'react-router-dom';
import { APP_NAME } from '@/constants/branding';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function PrivacyPage() {
  return (
    <main className="min-h-screen bg-muted/30 px-4 py-8 sm:px-6 sm:py-12">
      <Card className="mx-auto w-full max-w-3xl">
        <CardHeader className="space-y-3 px-6 pt-8 sm:px-10 sm:pt-10">
          <h1 className="text-3xl font-semibold tracking-tight">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">Last updated: October 22, 2026</p>
          <p className="text-sm leading-6 text-muted-foreground">
            This Privacy Policy describes how {APP_NAME} (“Dialog”, “we”, “us”, or “our”)
            handles information when you use our website, dashboard, APIs, and related
            messaging services.
          </p>
        </CardHeader>
        <CardContent className="space-y-8 px-6 pb-8 text-sm leading-6 text-muted-foreground sm:px-10 sm:pb-10">
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">1. Who this policy covers</h2>
            <p>
              Dialog provides business tools for managing WhatsApp Business accounts,
              templates, message delivery, and related integrations. This policy applies to
              people who visit our website or use Dialog on behalf of a business.
            </p>
            <p>
              When a business uses Dialog to send messages or provide us with information
              about its customers, that business is responsible for providing any required
              notices and obtaining any required permissions. We handle that information
              to provide the service and follow the business’s instructions.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">2. Information we handle</h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong className="text-foreground">Account and organization details:</strong>{' '}
                names, work email addresses, phone numbers, roles, and account or access
                settings.
              </li>
              <li>
                <strong className="text-foreground">WhatsApp and message data:</strong>{' '}
                connected business account and phone-number details, message recipients’
                phone numbers, message content and template variables, and delivery or
                interaction events such as timestamps and status.
              </li>
              <li>
                <strong className="text-foreground">Integration data:</strong> API and
                webhook configuration, event payloads, and technical information needed to
                connect Dialog with your systems.
              </li>
              <li>
                <strong className="text-foreground">Usage and device data:</strong> log
                information, IP address, browser and device details, and actions taken in
                the service, used for support, security, and reliability.
              </li>
              <li>
                <strong className="text-foreground">Support communications:</strong>{' '}
                information you choose to include when you contact us.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">3. How we use information</h2>
            <p>We use information as needed to:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>provide and maintain Dialog, including sending messages and showing delivery status;</li>
              <li>connect with WhatsApp and other services you choose to use;</li>
              <li>secure accounts, prevent misuse, troubleshoot issues, and provide support;</li>
              <li>operate, measure, and improve the service; and</li>
              <li>meet applicable legal obligations and enforce our agreements.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">4. How information is shared</h2>
            <p>
              We share information only as needed to provide the service, including with
              WhatsApp/Meta when you connect a WhatsApp Business account or send messages;
              with hosting, infrastructure, and support providers that help us operate
              Dialog; and with people in your organization who are authorized to use your
              account. We may also disclose information where required by law or necessary
              to protect the rights, safety, and security of users and the service.
            </p>
            <p>
              Your use of WhatsApp and other connected services is also subject to their
              own terms and privacy policies. Information delivered to a webhook or another
              system you configure is handled according to your settings and that
              system’s practices.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">5. Retention and security</h2>
            <p>
              We keep information for as long as needed to provide Dialog, meet the
              purposes described here, resolve disputes, and comply with legal obligations.
              Retention can vary by data type and service configuration. When information
              is no longer needed, we take reasonable steps to delete or de-identify it,
              subject to applicable law and backup or security requirements.
            </p>
            <p>
              We use reasonable administrative, technical, and organizational safeguards
              to protect information. No method of storage or transmission is completely
              secure, so we cannot guarantee absolute security.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">6. Your choices and requests</h2>
            <p>
              You can manage your account details and connected integrations through
              Dialog. If you are an end user whose information was provided to Dialog by
              a business, please contact that business first. Account holders can contact
              us to ask questions or submit a privacy request. We may need to verify your
              identity and coordinate with the relevant business before responding.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">7. Changes to this policy</h2>
            <p>
              We may update this policy as Dialog or applicable requirements change. We
              will update the date above when we do. Continued use of Dialog after an
              update means the revised policy applies, subject to applicable law.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">8. Contact us</h2>
            <p>
              For questions or privacy requests, email{' '}
              <a
                href="mailto:contact@trizenventures.com"
                className="font-medium text-primary underline underline-offset-4"
              >
                contact@trizenventures.com
              </a>
              .
            </p>
          </section>

          <div className="border-t pt-6">
            <Button asChild variant="outline">
              <Link to="/">Back to home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
