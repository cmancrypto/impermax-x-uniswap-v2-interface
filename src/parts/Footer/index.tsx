
import * as React from 'react';
import clsx from 'clsx';

type Ref = HTMLDivElement;
type Props = React.ComponentPropsWithRef<'footer'>;

const Footer = React.forwardRef<Ref, Props>(({
  className,
  ...rest
}, ref): JSX.Element => (
  <footer
    ref={ref}
    className={clsx(
      'text-center',
      'text-textSecondary',
      className
    )}
    {...rest}>
    <div
      className={clsx(
        'p-6',
        'space-x-8'
      )}>
      <a
        href='https://impermax.finance/'
        target='_blank'
        rel='noopener noreferrer'>
        Website
      </a>
      <a
        href='https://twitter.com/ImpermaxFinance'
        target='_blank'
        rel='noopener noreferrer'>
        Twitter
      </a>
      <a
        href='https://t.me/ImpermaxFinance'
        target='_blank'
        rel='noopener noreferrer'>
        Telegram
      </a>
      <a
        href='https://discord.gg/XN739EgG4X'
        target='_blank'
        rel='noopener noreferrer'>
        Discord
      </a>
      <a
        href='https://impermax.medium.com/'
        target='_blank'
        rel='noopener noreferrer'>
        Medium
      </a>
      <a
        href='https://www.reddit.com/r/ImpermaxFinance/'
        target='_blank'
        rel='noopener noreferrer'>
        Reddit
      </a>
      <a
        href='https://github.com/Impermax-Finance'
        target='_blank'
        rel='noopener noreferrer'>
        Github
      </a>
    </div>
  </footer>
));
Footer.displayName = 'Footer';

export default Footer;
