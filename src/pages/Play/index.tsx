import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { SystemProgram, Transaction, LAMPORTS_PER_SOL, PublicKey, TransactionInstruction } from '@solana/web3.js';
import { WalletSendTransactionError } from '@solana/wallet-adapter-base';
import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useUnityContext } from 'contexts/UnityProvider';
import Unity, { UnityEventListener } from 'components/unity/Unity';
import * as indexer from 'services/indexer';
import Ranking from 'pages/Ranking';
import { useInterval } from 'hooks/useInterval';

// const Admin = '5ZokCQVGde4gTVudPiz2eiWeBLHRk51jRp5jp4bjDc9w';
const CauseList = [
  '5ZokCQVGde4gTVudPiz2eiWeBLHRk51jRp5jp4bjDc9w',
  '6F3ooBg3gEAnTT5dCxgdrukcAKBBz2AEj2c2W7fP6khK',
  'HSstEpyaWnSARpMotEpUsVcbnWH4bwq7VWxpau6FRkx1',
  'A8uh5DM48KJ8A4fygHEdikhLwBfbvPGy1Utuur418yf8',
];

const Play = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const { unityContext } = useUnityContext();
  const { /*isLoaded,*/ sendMessage } = unityContext;
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    if (publicKey) {
      toast.success('Wallet Connected! Please make sure your network is devnet', {
        duration: 5000,
      });
    }
  }, [publicKey]);

  const updateRanking = useCallback(() => {
    indexer.meltingRanking().then((data) => {
      data && setRanking(data.ranking);
    });
  }, []);

  useInterval(() => {
    updateRanking();
  }, 3000);

  /*useEffect(() => {
    (async () => {
      if (isLoaded && publicKey) {
        console.log('[Web] Send Wallet Address to Unity', publicKey);
        // Send wallet connected state.
        sendMessage('GFS', 'WalletConnected', publicKey.toString());
      }
    })();
  }, [isLoaded, sendMessage, publicKey]);*/

  const onSyncWallet = useCallback(() => {
    sendMessage('GFS', 'WalletAddress', publicKey ? publicKey.toString() : '');
  }, [sendMessage, publicKey]);

  const onSendTransaction = useCallback(
    async (params) => {
      console.log('SendTransaction-Params', params);
      if (!publicKey) {
        toast.error('Please connect your wallet!');
        sendMessage('GFS', 'TransactionFailed', 'No wallet');
        return;
      }

      let data = JSON.parse(params);
      console.log('SendTransaction-Data', data);

      let values: number[] = [Number(data.cause1), Number(data.cause2), Number(data.cause3), Number(data.cause4)];

      let totalAmount = 0;
      let items: TransactionInstruction[] = [];
      for (let i = 0; i < values.length; i++) {
        const value = values[i];
        if (!isNaN(value) && value > 0) {
          const address = CauseList[i];
          const amount = LAMPORTS_PER_SOL * value;
          const tx = SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: new PublicKey(address),
            lamports: amount,
          });
          items.push(tx);
          totalAmount += value;
        }
      }
      if (!items.length) {
        if (data.email) {
          await indexer.melting(data.email, publicKey.toString(), 0);
        }
        sendMessage('GFS', 'TransactionComplete');
        toast.success('Success');
        return;
      }

      try {
        const balance = await connection.getBalance(publicKey);
        if (balance < totalAmount) {
          toast.error('You have no enough balance!');
          sendMessage('GFS', 'TransactionFailed', 'Not enough balance');
          return;
        }

        const transaction = new Transaction().add(...items);
        const {
          context: { slot: minContextSlot },
          value: { blockhash, lastValidBlockHeight },
        } = await connection.getLatestBlockhashAndContext();

        const signature = await sendTransaction(transaction, connection, { minContextSlot });
        await connection.confirmTransaction({ blockhash, lastValidBlockHeight, signature });

        await indexer.melting(data.email, publicKey.toString(), totalAmount);

        sendMessage('GFS', 'TransactionComplete');
        toast.success('Success');
      } catch (err: any) {
        console.error(err, err?.error);
        if (err instanceof WalletSendTransactionError) {
          toast.error(err?.message);
        } else {
          toast.error('Something went wrong');
        }
      }
    },
    [publicKey, connection, sendMessage, sendTransaction]
  );

  const onSendScore = useCallback(
    async (score) => {
      console.log('onSendScore', score);
      if (publicKey) {
        await indexer.updateMeltingScore(publicKey.toString(), score);
      }
      updateRanking();
    },
    [publicKey, updateRanking]
  );

  const eventListeners = useMemo((): UnityEventListener[] => {
    return [
      { eventName: 'onSyncWallet', callback: onSyncWallet },
      { eventName: 'SendTransaction', callback: onSendTransaction },
      { eventName: 'GameOver', callback: onSendScore },
      { eventName: 'SendScore', callback: onSendScore },
    ];
  }, [onSyncWallet, onSendTransaction, onSendScore]);

  /*const handleTransaction = useCallback(async () => {
    if (publicKey) {
      try {
        const amount = 0.001 * LAMPORTS_PER_SOL;
        const balance = await connection.getBalance(publicKey);
        console.log('balance', balance);
        if (balance < amount) {
          toast.error('You have no enough balance!');
          return;
        }

        const transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: new PublicKey(Admin), //Keypair.generate().publicKey,
            lamports: amount,
          }),
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: new PublicKey(Admin),
            lamports: amount * 2,
          })
        );
        const {
          context: { slot: minContextSlot },
          value: { blockhash, lastValidBlockHeight },
        } = await connection.getLatestBlockhashAndContext();

        const signature = await sendTransaction(transaction, connection, { minContextSlot });
        await connection.confirmTransaction({ blockhash, lastValidBlockHeight, signature });

        console.log('success');
      } catch (err) {
        console.error(err);
        toast.error('Something went wrong');
      }
    }
  }, [publicKey, connection, sendTransaction]);*/

  return (
    <div className="container mx-auto mt-4">
      <Unity
        unityContext={unityContext}
        eventListeners={eventListeners}
        styles={{
          height: 540,
          width: 950,
          background: '#555',
        }}
      ></Unity>
      {/* <div className="flex flex-row justify-center w-full mt-4">
        <button
          className="block px-6 py-2.5 mt-4 font-medium leading-5 text-center text-white capitalize bg-blue-600 rounded-lg lg:mt-0 hover:bg-blue-500 lg:w-auto"
          onClick={handleTransaction}
          disabled={!publicKey}
        >
          Transaction
        </button>
      </div> */}
      <Ranking users={ranking} />
    </div>
  );
};

export default Play;
