import React from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Link from "@docusaurus/Link";

export default function GithubLink({ to, children }) {
  return (
    <Link
      to={`${
        useDocusaurusContext().siteConfig.customFields.githubURL
      }/blob/master/${to}`}
    >
      {children}
    </Link>
  );
}
