import { BRAND, LAB, RESEARCH, SITE, SITE_NAME } from "../config";
import {
  PATHS,
  absoluteUrl,
  assetUrl,
  labSameAs,
  memberAffiliation,
  memberAnswer,
  sameAsFor,
  universitySameAs,
} from "./site";
import { isAlumni, memberNowLine, memberPath, memberPhotoPath } from "./members";
import type { Member, ProjectItem } from "../types";

function labAddress() {
  return {
    "@type": "PostalAddress",
    streetAddress: "University Road, Hengam Street, Resalat Square, Narmak",
    addressLocality: LAB.city,
    postalCode: LAB.postalCode,
    addressCountry: "IR",
  };
}

const universityId = `${LAB.universityUrl}#university`;

function universityNode() {
  return {
    "@type": "CollegeOrUniversity",
    "@id": universityId,
    name: LAB.university,
    alternateName: [LAB.universityShort, LAB.universityFa, "Iran Univ. of Science and Technology"],
    url: LAB.universityUrl,
    sameAs: universitySameAs(),
    address: labAddress(),
    department: { "@id": `${absoluteUrl(PATHS.lab)}#lab` },
  };
}

function labNode(members: Member[] = []) {
  const director = members.find((member) => member.leadership === "director");
  return {
    "@type": ["ResearchOrganization", "EducationalOrganization"],
    "@id": `${absoluteUrl(PATHS.lab)}#lab`,
    name: LAB.fullName,
    alternateName: [LAB.name, LAB.nameFa, "DSLab", "Distributed Systems Research Laboratory"],
    url: absoluteUrl(PATHS.lab),
    logo: {
      "@type": "ImageObject",
      url: assetUrl(BRAND.logo),
      contentUrl: assetUrl(BRAND.logo),
      width: 800,
      height: 800,
      caption: SITE_NAME,
    },
    image: assetUrl(BRAND.logo),
    parentOrganization: { "@id": universityId },
    department: LAB.school,
    email: LAB.email,
    telephone: LAB.phone,
    foundingDate: String(LAB.foundingYear),
    address: labAddress(),
    geo: {
      "@type": "GeoCoordinates",
      latitude: LAB.latitude,
      longitude: LAB.longitude,
    },
    sameAs: labSameAs(),
    knowsAbout: RESEARCH.map((item) => item.name),
    member: members.map((member) => ({ "@id": `${absoluteUrl(memberPath(member.name))}#person` })),
    employee: director
      ? { "@id": `${absoluteUrl(memberPath(director.name))}#person` }
      : undefined,
  };
}

function websiteNode() {
  return {
    "@type": "WebSite",
    "@id": `${SITE.origin}/#website`,
    name: SITE_NAME,
    alternateName: [LAB.fullName, LAB.name, LAB.nameFa, "DSLab"],
    url: SITE.origin,
    inLanguage: ["en", "fa"],
    publisher: { "@id": `${absoluteUrl(PATHS.lab)}#lab` },
    about: [
      { "@id": `${absoluteUrl(PATHS.lab)}#lab` },
      { "@id": universityId },
    ],
  };
}

function personNode(member: Member) {
  const url = absoluteUrl(memberPath(member.name));
  const isDirector = member.leadership === "director";
  const alumni = isAlumni(member);
  const aliases = [
    ...(isDirector ? [LAB.director, LAB.directorFa, "دکتر محسن شریفی", "محسن شریفی"] : []),
    member.aka,
  ].filter((value, index, list): value is string => Boolean(value) && list.indexOf(value) === index);
  const currentOrg = member.affiliation
    ? { "@type": "Organization", name: member.affiliation }
    : undefined;

  return {
    "@type": "Person",
    "@id": `${url}#person`,
    name: member.name,
    alternateName: aliases.length ? aliases : undefined,
    jobTitle: isDirector
      ? `${member.role}; Lab Director`
      : (memberNowLine(member) || member.position || member.role),
    description: memberAnswer(member),
    url,
    image: assetUrl(memberPhotoPath(member)) || undefined,
    email: member.email || undefined,
    homeLocation: member.location || undefined,
    affiliation: alumni && currentOrg ? currentOrg : { "@id": `${absoluteUrl(PATHS.lab)}#lab` },
    worksFor: alumni
      ? currentOrg
      : { "@id": `${absoluteUrl(PATHS.lab)}#lab` },
    alumniOf: alumni
      ? { "@id": `${absoluteUrl(PATHS.lab)}#lab` }
      : { "@id": universityId },
    knowsAbout: member.focus?.length ? member.focus : undefined,
    sameAs: sameAsFor(member),
    identifier: member.github ? { "@type": "PropertyValue", propertyID: "github", value: member.github } : undefined,
  };
}

function breadcrumb(items: Array<{ name: string; path: string }>) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

function faq(entries: Array<{ question: string; answer: string }>) {
  return {
    "@type": "FAQPage",
    mainEntity: entries.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: { "@type": "Answer", text: entry.answer },
    })),
  };
}

function graph(nodes: unknown[]) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes.filter(Boolean),
  };
}

/** English FAQs shown on the homepage and lab page. */
export function homeFaqs() {
  return [
    {
      question: `What is ${LAB.name}?`,
      answer: `${LAB.fullName} (${LAB.name}) is a research laboratory at the ${LAB.school}, ${LAB.university}. It has been directed by ${LAB.director} since ${LAB.foundingYear} and works on distributed operating systems, high-performance computing, cloud environments, complex event processing, wireless sensor-actor networks, and computer security.`,
    },
    {
      question: `Who is ${LAB.director}?`,
      answer: `${LAB.director} is Professor of System Software Engineering at ${LAB.university} and director of ${LAB.fullName}. His research focuses on distributed operating systems, high-performance computing, and distributed kernelware.`,
    },
    {
      question: `Where is ${LAB.fullName} located?`,
      answer: `${LAB.name} is in the ${LAB.school}, ${LAB.university}, University Road, Hengam Street, Resalat Square, Narmak, Tehran, Iran. Postal code ${LAB.postalCode}.`,
    },
    {
      question: `What does ${LAB.name} research?`,
      answer: `The lab researches ${RESEARCH.map((item) => item.name).join("; ")}. The long-term aim is a truly distributed operating system.`,
    },
  ];
}

/** Persian FAQ entries for JSON-LD only (not shown in visible FAQ UI). */
export function labFaqsSchemaOnly() {
  return [
    {
      question: `${LAB.nameFa} چیست؟`,
      answer: `${LAB.nameFa} همان ${LAB.fullName} در ${LAB.schoolFa}، ${LAB.universityFa} است و از سال ${LAB.foundingYear} تحت هدایت ${LAB.directorFa} فعالیت می‌کند.`,
    },
  ];
}

export function labFaqs() {
  return homeFaqs();
}

export function memberFaqs(member: Member) {
  return [
    {
      question: `Who is ${member.name}?`,
      answer: memberAnswer(member),
    },
    {
      question: `Where does ${member.name} work?`,
      answer: `${memberAffiliation(member)}. The lab website is ${SITE.origin}.`,
    },
  ];
}

export function homeGraph(members: Member[]) {
  return graph([
    websiteNode(),
    labNode(members),
    universityNode(),
    ...members.filter((member) => member.leadership === "director").map(personNode),
    breadcrumb([{ name: SITE_NAME, path: PATHS.home }]),
    faq(homeFaqs()),
  ]);
}

export function labGraph(members: Member[]) {
  return graph([
    {
      "@type": "AboutPage",
      "@id": `${absoluteUrl(PATHS.lab)}#page`,
      url: absoluteUrl(PATHS.lab),
      name: `${LAB.fullName} (${LAB.name})`,
      isPartOf: { "@id": `${SITE.origin}/#website` },
      about: { "@id": `${absoluteUrl(PATHS.lab)}#lab` },
      mainEntity: { "@id": `${absoluteUrl(PATHS.lab)}#lab` },
    },
    websiteNode(),
    labNode(members),
    universityNode(),
    breadcrumb([
      { name: LAB.name, path: PATHS.home },
      { name: LAB.fullName, path: PATHS.lab },
    ]),
    faq([...labFaqs(), ...labFaqsSchemaOnly()]),
  ]);
}

export function researchGraph(members: Member[]) {
  return graph([
    {
      "@type": "CollectionPage",
      "@id": `${absoluteUrl(PATHS.research)}#page`,
      url: absoluteUrl(PATHS.research),
      name: `Research — ${LAB.name}`,
      isPartOf: { "@id": `${SITE.origin}/#website` },
      about: { "@id": `${absoluteUrl(PATHS.lab)}#lab` },
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: RESEARCH.length,
        itemListElement: RESEARCH.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          description: item.text,
        })),
      },
    },
    websiteNode(),
    labNode(members),
    universityNode(),
    breadcrumb([
      { name: LAB.name, path: PATHS.home },
      { name: "Research", path: PATHS.research },
    ]),
  ]);
}

export function publicationsGraph(members: Member[], projects: ProjectItem[] = []) {
  return graph([
    {
      "@type": "CollectionPage",
      "@id": `${absoluteUrl(PATHS.publications)}#page`,
      url: absoluteUrl(PATHS.publications),
      name: `Publications — ${LAB.name}`,
      isPartOf: { "@id": `${SITE.origin}/#website` },
      about: { "@id": `${absoluteUrl(PATHS.lab)}#lab` },
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: projects.length,
        itemListElement: projects.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.title,
          description: item.description,
        })),
      },
    },
    websiteNode(),
    labNode(members),
    universityNode(),
    breadcrumb([
      { name: LAB.name, path: PATHS.home },
      { name: "Publications", path: PATHS.publications },
    ]),
  ]);
}

export function peopleIndexGraph(members: Member[]) {
  return graph([
    {
      "@type": "CollectionPage",
      "@id": `${absoluteUrl(PATHS.people)}#page`,
      url: absoluteUrl(PATHS.people),
      name: `People of ${LAB.name}`,
      isPartOf: { "@id": `${SITE.origin}/#website` },
      about: { "@id": `${absoluteUrl(PATHS.lab)}#lab` },
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: members.length,
        itemListElement: members.map((member, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: absoluteUrl(memberPath(member.name)),
          name: member.name,
        })),
      },
    },
    websiteNode(),
    labNode(members),
    breadcrumb([
      { name: LAB.name, path: PATHS.home },
      { name: "People", path: PATHS.people },
    ]),
  ]);
}

export function memberGraph(member: Member, members: Member[]) {
  const url = absoluteUrl(memberPath(member.name));
  return graph([
    {
      "@type": "ProfilePage",
      "@id": `${url}#page`,
      url,
      name: member.name,
      isPartOf: { "@id": `${SITE.origin}/#website` },
      about: { "@id": `${url}#person` },
      mainEntity: { "@id": `${url}#person` },
    },
    personNode(member),
    websiteNode(),
    labNode(members),
    universityNode(),
    breadcrumb([
      { name: LAB.name, path: PATHS.home },
      { name: "People", path: PATHS.people },
      { name: member.name, path: memberPath(member.name) },
    ]),
    faq(memberFaqs(member)),
  ]);
}

export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
