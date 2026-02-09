import React, { useEffect, useRef, useState } from 'react';
import SessionItem from '../components/SessionItem.tsx';
import { SESSIONS } from '../dummy-sessions.ts'; // normally, we would probably load that from a server
import { BookSession } from '../types/types.ts';
import { SessionApi } from '../api/SessionApi.ts';
import { BookSessionContextValue, useBookSessionContext } from '../context/SessionsContext.tsx';

export default function SessionsPage() {

  console.log('React działa', React.version);
  //saveSession(SESSIONS[1]);
  //const [sessions, setSessions] = useState<BookSession[] | null>(null)
  const bookSessionContext = useBookSessionContext();
  

  return (
    <main id="sessions-page">
      <header>
        <h2>Available mentoring sessions</h2>
        <p>
          From an one-on-one introduction to React's basics all the way up to a
          deep dive into state mechanics - we got just the right session for
          you!
        </p>
      </header>

      <div id='content'>
        {bookSessionContext.sessions === null && <div>Loading...</div>}
        {bookSessionContext.sessions &&
          <div className='grid grid-cols-2 gap-2'>

            {bookSessionContext.sessions.map(s => {
              return <SessionItem mode='public' session={s}></SessionItem>
            })
            }

          </div>
        }
      </div>
    </main>
  );
}
