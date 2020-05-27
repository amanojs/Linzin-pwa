import * as React from 'react';
import next, { NextPage } from 'next';
import Head from 'next/head';
import { Button } from './components/Atoms/Button';
import Link from 'next/link';

const IndexPage: NextPage = () => {
  return (
    <React.Fragment>
      <Head>
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <h1>Hello, template-nextjs-pwa!!</h1>
      <p>This is a sample page</p>
      <Link href={{ pathname: '/TestPage', query: { name: 'Amano' } }} as="/Amano/TestPage">
        <a>
          <Button color="#fff" backcolor="#555" value="テストボタン" />
        </a>
      </Link>
    </React.Fragment>
  );
};

export default IndexPage;
