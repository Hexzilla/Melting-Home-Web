import { UnityProvider } from 'contexts/UnityProvider';
import Play from '../Play';

const unityConfig = {
  loaderUrl: 'Build/f75cbd82df65cb67bd199e93eef8bd25.js',
  dataUrl: 'Build/ef201b52cf5f9626f7e9c8761b867ebe.data.unityweb',
  frameworkUrl: 'Build/ece249e49e6c5af394870b6f383feec8.js.unityweb',
  codeUrl: 'Build/3235e7a8a5569761e8d9e7429155285c.wasm.unityweb',
};

const Home = () => {
  return (
    <UnityProvider unityConfig={unityConfig}>
      <Play />
    </UnityProvider>
  );
};

export default Home;
