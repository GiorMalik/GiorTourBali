
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface VerificationEmailProps {
  name: string;
  otp: string;
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://giorbalitour.com";

export const VerificationEmail = ({ name, otp }: VerificationEmailProps) => (
  <Html>
    <Head />
    <Preview>Your GiorBaliTour Verification Code</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoContainer}>
          <Img
            src={`${baseUrl}/logo.png`}
            width="80"
            height="80"
            alt="GiorBaliTour Logo"
          />
        </Section>
        <Heading style={h1}>Verify Your Identity</Heading>
        <Text style={text}>
          Hello {name},
        </Text>
        <Text style={text}>
          Thank you for registering with GiorBaliTour. To complete your registration,
          please use the following One-Time Password (OTP):
        </Text>
        <Section style={codeContainer}>
          <Text style={code}>{otp}</Text>
        </Section>
        <Text style={text}>
          This code will expire in 3 minutes. If you did not request this code,
          please ignore this email.
        </Text>
        <Section style={footer}>
          <Text style={footerText}>
            © {new Date().getFullYear()} GiorBaliTour. All rights reserved.
          </Text>
          <Link href={baseUrl} style={footerLink}>
            giorbalitour.com
          </Link>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default VerificationEmail;

const main = {
  backgroundColor: "#0B0C10",
  fontFamily: '"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
  color: "#E5E5E5",
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "580px",
  maxWidth: "100%",
};

const logoContainer = {
  textAlign: "center" as const,
  marginBottom: "24px",
};

const h1 = {
  color: "#FFFFFF",
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "24px 0",
};

const text = {
  fontSize: "14px",
  lineHeight: "24px",
  textAlign: "left" as const,
  marginBottom: "16px",
};

const codeContainer = {
  background: "#1F2937",
  borderRadius: "8px",
  margin: "24px 0",
  padding: "12px",
  textAlign: "center" as const,
};

const code = {
  color: "#66FCF1",
  fontSize: "32px",
  fontWeight: "bold",
  letterSpacing: "4px",
};

const footer = {
  marginTop: "24px",
  textAlign: "center" as const,
};

const footerText = {
  color: "#A3A3A3",
  fontSize: "12px",
};

const footerLink = {
  color: "#45A29E",
  textDecoration: "underline",
  fontSize: "12px",
};
