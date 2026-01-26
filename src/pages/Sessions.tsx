import { useEffect, useState } from 'react';
import { getSessions, saveSession } from '../api/SessionApi.ts';
import SessionItem from '../components/SessionItem.tsx';
import { SESSIONS } from '../dummy-sessions.ts'; // normally, we would probably load that from a server
import { BookSession } from '../types/types.ts';

export default function SessionsPage() {

  //SESSIONS.forEach(s => {delete s.id; saveSession(s)})

  //saveSession(SESSIONS[1]);
  const [sessions, setSessions] = useState<BookSession[] | null>(null)

  useEffect(() => {
    async function loadSessions() {
      setSessions(await getSessions())
    }
    loadSessions();
  })

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
        {sessions === null && <div>Loading...</div>}
        {sessions &&
          <div className='grid grid-cols-2 gap-2'>

            {sessions.map(s => {
              return <SessionItem session={s}></SessionItem>
            })
            }

          </div>
        }
      </div>
    </main>
  );
}
