import { Container } from '@repo/ui/custom_components/container'
import React from 'react'

const footerLinks = [
    {
      title: "Product",
      links: [
        { title: "Features", href: "#" },
        { title: "Integrations", href: "#" },
        { title: "Pricing", href: "#" },
        { title: "Changelog", href: "#" },
        { title: "Docs", href: "#" },
        { title: "Linear Method", href: "#" },
        { title: "Download", href: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { title: "About us", href: "#" },
        { title: "Blog", href: "#" },
        { title: "Careers", href: "#" },
        { title: "Customers", href: "#" },
        { title: "Brand", href: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { title: "Community", href: "#" },
        { title: "Contact", href: "#" },
        { title: "DPA", href: "#" },
        { title: "Terms of service", href: "#" },
      ],
    },
    {
      title: "Developers",
      links: [
        { title: "API", href: "#" },
        { title: "Status", href: "#" },
        { title: "GitHub", href: "#" },
      ],
    },
  ];

const Footer = () => {
  return (
    <footer className='border-t border-grey-dark py-[5.6rem] text-sm'>
        <Container>
            <div>logo</div>
            <div>links</div>
        </Container>
    </footer>
  )
}

export default Footer