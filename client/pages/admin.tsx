import type { NextPage } from 'next'
import Demo from '../components/demo'
import AdminLayout from '../layouts/default'
import styles from '../styles/Home.module.css'
import { NextPageWithLayout } from './_app'
import { Divider, Paper, Tabs } from '@mantine/core';
import UserSection from '../components/users'

const Admin: NextPageWithLayout = () => {
  return (
    <div className={styles.container}>
      <UserSection />      
    </div>
  )
}

Admin.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>
}

export default Admin
