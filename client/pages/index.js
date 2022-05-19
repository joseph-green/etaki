
import App from '../components/App/App';

function AppPage (props) {
    return <App/>
}

AppPage.getInitialProps = async (ctx) => {
    const initialProps = {}
    return { ...initialProps }
  }
  
  
export default AppPage;