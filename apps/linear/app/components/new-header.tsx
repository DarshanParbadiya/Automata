'use client';
import Link from 'next/link';
import React from 'react';
import { Logo } from './icons/logo';
import { Container } from '@repo/ui/custom_components/container';
import Button from './button';
import { HamburgerIcon } from './icons/hamburger';
import { cn } from '@repo/ui/lib/utils';

const NewHeader = () => {
  const [hambugerMenuIsOpen, sethambugerMenuIsOpen] = React.useState(false);
  return (
    <header className='fixed top-0 left-0 w-full'>
      <Container className="backdrop-blur-[12px] ">
        <div className="px-4 flex h-navigation-height border border-grey-dark rounded-2xl mt-5">
          <Link href="/" className="flex items-center text-md">
            <Logo className="w-[1.8rem] h-[1.8rem] mr-2" />
            Linear
          </Link>
          <div
            className={cn(
              'transition-[visibility] md:visible',
              hambugerMenuIsOpen ? 'visible' : 'invisible delay-800'
            )}
          >
            <nav
              className={cn(
                'transition-opacity duration-500 fixed h-[calc(100vh_-_var(--navigation-height))] md:block  top-navigation-height left-0 w-full  overflow-auto bg-background',
                'md:relative md:h-auto md:w-auto md:top-0 md:bg-transparent',
                hambugerMenuIsOpen ? ' opacity-100' : ' opacity-0 '
              )}
            >
              <ul
                className={cn(
                  'flex h-full flex-col mx-5 md:mx-0 md:flex-row md:items-center [&_li]:ml-6 [&_li]:border-b [&_li]:border-grey-dark md:[&_li]:border-none',
                  'ease-in [&_a:hover]:text-grey [&_a]:flex [&_a]:h-navigation-height [&_a]:w-full [&_a]:translate-y-8 [&_a]:items-center [&_a]:text-lg [&_a]:transition-[color,transform] [&_a]:duration-300 md:[&_a]:translate-y-0 md:[&_a]:text-sm [&_a]:md:transition-colors',
                  hambugerMenuIsOpen && '[&_a]:translate-y-0 '
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
          <div className="ml-auto h-full flex items-center [&_a]:text-sm">
            <Link className="mr-6" href="#">
              Log in
            </Link>
            <Button variant={'primary'} href="#">
              Sign up
            </Button>
          </div>
          <button
            className="ml-6 md:hidden"
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
