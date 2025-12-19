import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Button,
} from '@react-email/components';

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({
  username,
  otp,
}: VerificationEmailProps) {
  return (
    <Html lang="en">
      <Head>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>

      {/* Inbox preview text */}
      <Preview>Your verification code is {otp}</Preview>

      <Section
        style={{
          padding: '24px',
          fontFamily: 'Roboto, Verdana, sans-serif',
        }}
      >
        <Row>
          <Heading as="h2">Hello {username},</Heading>
        </Row>

        <Row>
          <Text>
            Thank you for registering. Please use the verification code below
            to complete your registration:
          </Text>
        </Row>

        <Row>
          <Text
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              letterSpacing: '2px',
              margin: '12px 0',
            }}
          >
            {otp}
          </Text>
        </Row>

        <Row>
          <Text>
            If you did not request this code, you can safely ignore this email.
          </Text>
        </Row>

        <Row>
          <Button
            href={`http://localhost:3000/verify/${username}`}
            style={{
              backgroundColor: '#61dafb',
              color: '#000',
              padding: '10px 18px',
              borderRadius: '6px',
              textDecoration: 'none',
              display: 'inline-block',
              marginTop: '12px',
            }}
          >
            Verify Account
          </Button>
        </Row>
      </Section>
    </Html>
  );
}
