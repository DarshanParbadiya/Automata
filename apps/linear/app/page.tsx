import Image, { type ImageProps } from 'next/image';
import { Container } from '@repo/ui/custom_components/container';
import Hero, { HeroSubTitle, HeroTitle } from './components/hero';
import Button, { IconWrapper } from './components/button';
import { FaArrowRight } from 'react-icons/fa6';
import { FaAngleRight } from 'react-icons/fa';
type Props = Omit<ImageProps, 'src'> & {
  srcLight: string;
  srcDark: string;
};

export default function Home() {
  return (
    <div className="">
      <main>
        <Container className="pt-[6.4rem]">
          <Hero className="">
            <Button
              className="animate-fade-in opacity-0 translate-y-[-1rem]"
              variant={'secondary'}
              size={'small'}
              href="/"
            >
              New feature just released - Built for Scale
              <IconWrapper className="ml-2 bg-transparent-white">
                <FaArrowRight />
              </IconWrapper>
            </Button>
            <HeroTitle className="animate-fade-in [--animation-delay:200ms] opacity-0 translate-y-[-1rem]">
              Welcome To Linear better
              <br className="hidden md:block" /> way to build software
            </HeroTitle>
            <HeroSubTitle className="animate-fade-in  [--animation-delay:400ms] opacity-0 translate-y-[-1rem]">
              Automation Software to meet new standards
              <br className="hidden md:block" /> of software development
            </HeroSubTitle>
            <Button
              className="animate-fade-in  [--animation-delay:600ms] opacity-0 translate-y-[-1rem]"
              variant={'primary'}
              size={'medium'}
              href="/"
            >
              Get Started
              <IconWrapper className="ml-2 bg-transparent-white opacity-70">
                <FaAngleRight />
              </IconWrapper>
            </Button>
            <img
              className="mt-[12.8rem]"
              src="/images/hero-image.png"
              alt="hero"
            />
          </Hero>
        </Container>
      </main>
    </div>
  );
}
