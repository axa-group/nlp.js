import React from "react";
import Link from "@docusaurus/Link";

export default function GithubLink({ to, children }) {
  return (
    <Link to={`https://github.com/axa-group/nlp.js/blob/master/${to}`}>
      {children}
    </Link>
  );
}
