import * as React from 'react';
import next, { NextPage } from 'next';
import Head from 'next/head';
import { Button } from './components/Atoms/Button';
import Link from 'next/link';

const TestPage: NextPage = () => {
  return (
    <React.Fragment>
      <Head>
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <h1>TestPage</h1>
      <Link href="/">
        <a>
          <Button color="#fff" backcolor="#555" value="テストボタン" />
        </a>
      </Link>
    </React.Fragment>
  );
};

export default TestPage;
