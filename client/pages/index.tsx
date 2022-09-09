import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Demo from '../components/demo'
import AdminLayout from '../layouts/default'
import styles from '../styles/Home.module.css'
import { NextPageWithLayout } from './_app'

const Home: NextPageWithLayout = () => {
  return (
    <div className={styles.container}>
      <Demo />
    </div>
  )
}

Home.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>
}

export default Home
