import Image, { type ImageProps } from 'next/image';
import { Container } from '@repo/ui/custom_components/container';
import Hero, { HeroSubTitle, HeroTitle } from './components/hero';

type Props = Omit<ImageProps, 'src'> & {
  srcLight: string;
  srcDark: string;
};


export default function Home() {
  return (
    <div className="">
     
      <main>
        <Container>
          <Hero>
            <HeroTitle>
              Welcome To Linear better
              <br /> way to build software
            </HeroTitle>
            <HeroSubTitle>
              Automation Software to meet new standards
              <br /> of software development
            </HeroSubTitle>
            <img src="/images/hero-image.png" alt="hero" />
          </Hero>
        </Container>
      </main>
      
    </div>
  );
}
