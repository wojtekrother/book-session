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
          <ul>

            {sessions.map(s => {
              return <li key={s.id}><SessionItem session={s}></SessionItem></li>
            })
            }

          </ul>
        }
      </div>
    </main>
  );
}
