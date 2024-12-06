'use client';
import Link from 'next/link';
import React from 'react';
import { Logo } from './icons/logo';
import { Container } from '@repo/ui/custom_components/container';
import Button from './button';
import { HamburgerIcon } from './icons/hamburger';
import { cn } from '@repo/ui/lib/utils';
import { useEffect } from 'react';

const NewHeader = () => {
  const [hamburgerMenuIsOpen, sethambugerMenuIsOpen] = React.useState(true);

  useEffect(() => {
    const html = document.querySelector('html');
    if (html) html.classList.toggle('overflow-hidden', hamburgerMenuIsOpen);
  }, [hamburgerMenuIsOpen]);

  useEffect(() => {
    const closeHamburgerNavigation = () => sethambugerMenuIsOpen(false);
    window.addEventListener('orientationchange', closeHamburgerNavigation);
    window.addEventListener('resize', closeHamburgerNavigation);
    return () => {
      window.removeEventListener('orientationchange', closeHamburgerNavigation);
      window.removeEventListener('resize', closeHamburgerNavigation);
    };
  }, [sethambugerMenuIsOpen]);

  return (
    <header className={cn("fixed top-0 left-0 w-full")}>
      <Container className="">
        <div
          className={cn(
            'px-4 backdrop-blur-[12px] h-navigation-height flex items-center border border-grey-dark rounded-2xl mt-5 relative',
            hamburgerMenuIsOpen ? 'h-[90vh] items-start pt-3' : 'h-navigation-height'
          )}
        >
          <Link href="/" className="flex items-center text-md ">
            <Logo className="w-[1.8rem] h-[1.8rem] mr-2" />
            Linear
          </Link>

          <div
            className={cn(
              'transition-[visibility] md:visible',
              hamburgerMenuIsOpen ? 'visible ' : 'invisible delay-800 '
            )}
          >
            <nav
              className={cn(
                'top-navigation-height absolute left-0 h-[calc(100vh_-_var(--navigation-height))] w-full  transition-opacity duration-500 md:relative md:top-0 md:block md:h-auto md:w-auto md:translate-x-0 md:overflow-hidden md:bg-transparent md:opacity-100 md:transition-none',
                hamburgerMenuIsOpen
                  ? 'translate-x-0 opacity-100 '
                  : 'translate-x-[-100vw] opacity-0'
              )}
            >
              <ul
                className={cn(
                  'flex h-full flex-col md:flex-row md:items-center [&_li]:ml-6 [&_li]:border-b [&_li]:border-grey-dark md:[&_li]:border-none',
                  'ease-in [&_a:hover]:text-grey [&_a]:flex [&_a]:h-navigation-height [&_a]:w-full [&_a]:translate-y-8 [&_a]:items-center [&_a]:text-lg [&_a]:transition-[color,transform] [&_a]:duration-300 md:[&_a]:translate-y-0 md:[&_a]:text-sm [&_a]:md:transition-colors',
                  hamburgerMenuIsOpen && '[&_a]:translate-y-0'
                )}
              >
                <li>
                  <Link href="#">Features</Link>
                </li>
                <li>
                  <Link href="#">Method</Link>
                </li>
                <li className="md:hidden lg:block">
                  <Link href="#">Customers</Link>
                </li>
                <li className="md:hidden lg:block">
                  <Link href="#">Changelog</Link>
                </li>
                <li className="md:hidden lg:block">
                  <Link href="#">Integrations</Link>
                </li>
                <li>
                  <Link href="#">Pricing</Link>
                </li>
                <li>
                  <Link href="#">Company</Link>
                </li>
              </ul>
            </nav>
          </div>
          <div className="hidden sm:ml-auto h-full sm:flex items-center [&_a]:text-sm">
            <Link className="mr-6" href="#">
              Log in
            </Link>
            <Button variant={'primary'} href="#">
              Sign up
            </Button>
          </div>
          <button
            className="ml-auto sm:ml-6 md:hidden"
            onClick={() => sethambugerMenuIsOpen((open) => !open)}
          >
            <span className="sr-only">Toggle menu</span>
            <HamburgerIcon />
          </button>
        </div>
      </Container>
    </header>
  );
};

export default NewHeader;
