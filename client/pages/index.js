import dynamic from 'next/dynamic'

const DynamicApp = dynamic(
  () => import('./components/App/App'),
  { ssr: false }
)


export default DynamicApp;