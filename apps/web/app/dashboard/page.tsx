'use client';
import { Appbar } from '@/components/Appbar';
import { DarkButton } from '@/components/buttons/DarkButton';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { BACKEND_URL, HOOKS_URL } from '../config';
import { LinkButton } from '@/components/buttons/LinkButton';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Zap {
  id: string;
  triggerId: string;
  userId: number;
  actions: {
    id: string;
    zapId: string;
    actionId: string;
    sortingOrder: number;
    type: {
      id: string;
      name: string;
      image: string;
    };
  }[];
  trigger: {
    id: string;
    zapId: string;
    triggerId: string;
    type: {
      id: string;
      name: string;
      image: string;
    };
  };
}

function useZaps() {
  const [loading, setLoading] = useState(true);
  const [zaps, setZaps] = useState<Zap[]>([]);
  const [user, setUser] = useState({});

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/user/user`, {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      })
      .then((res) => {
        setUser(res.data.user);
      });
    axios
      .get(`${BACKEND_URL}/api/v1/zap`, {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      })
      .then((res) => {
        setZaps(res.data.zaps);
        setLoading(false);
      });
  }, []);
  // console.log(user);

  return {
    loading,
    zaps,
    user,
  };
}

//eslint-disable-next-line
export default function () {
  const { loading, zaps, user } = useZaps();
  const router = useRouter();

  return (
    <div>
      <Appbar />
      <div className="flex justify-center pt-8">
        <div className="max-w-screen-lg	 w-full">
          <div className="flex justify-between pr-8 ">
            <div className="text-2xl font-bold">My Zaps</div>
            <DarkButton
              onClick={() => {
                router.push('/zap/create');
              }}
            >
              Create
            </DarkButton>
          </div>
        </div>
      </div>
      {loading ? (
        'Loading...'
      ) : (
        <div className="flex justify-center">
          {' '}
          {user && <ZapTable zaps={zaps} user={user} />}
        </div>
      )}
    </div>
  );
}

function ZapTable({ zaps, user }: { zaps: Zap[]; user: any }) {
  console.log(user)
  const router = useRouter();
  return (
    <div className="p-8 max-w-screen-lg w-full">
      <div className="flex">
        <div className="flex-1">Name</div>
        <div className="flex-1">ID</div>
        <div className="flex-1">Created at</div>
        <div className="flex-1">Webhook URL</div>
        <div className="flex-1">Go</div>
      </div>
      {zaps.map((z, index) => (
        <div key={index} className="flex border-b border-t py-4">
          <div className="flex-1 flex">
            <img src={z.trigger.type.image} className="w-[30px] h-[30px]" />{' '}
            {z.actions.map((x, index) => (
              <img
                src={x.type.image}
                className="w-[30px] h-[30px]"
                key={index}
              />
            ))}
          </div>
          <div className="flex-1">{z.id}</div>
          <div className="flex-1">Nov 13, 2023</div>
          {/* <Link href={`${HOOKS_URL}/hooks/catch/1/${z.id}`}> */}
          <div className="flex-1">{`${HOOKS_URL}/hooks/catch/${user.id}/${z.id}`}</div>
          {/* </Link> */}
          <div className="flex-1">
            <LinkButton
              onClick={() => {
                router.push('/zap/' + z.id);
              }}
            >
              Go
            </LinkButton>
          </div>
        </div>
      ))}
    </div>
  );
}
