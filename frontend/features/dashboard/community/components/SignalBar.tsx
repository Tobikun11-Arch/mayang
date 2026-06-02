'use client';

import type {User} from '../types';

interface Props {
  pinging: boolean;
  signalSent: boolean;
  signalReceived: User[] | null;
  onSendSignal: () => void;
  onFocusUser: (user: User) => void;
}

export default function SignalBar({
  pinging,
  signalSent,
  signalReceived,
  onSendSignal,
  onFocusUser
}: Props) {
  return (
    <div className="border-t border-gray-200 bg-white px-4 py-3">
      <div className="flex items-center gap-4">
        <button
          onClick={onSendSignal}
          disabled={pinging}
          className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition active:scale-95 ${
            pinging
              ? 'signal-btn-pinging bg-blue-100 text-blue-400 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {pinging ? 'Sending Signal…' : 'Send Signal'}
        </button>

        {/* Signal responses — each button calls onFocusUser to fly map to respondent */}
        {signalSent && !pinging && signalReceived && signalReceived.length > 0 && (
          <div className="flex items-center gap-3 text-sm">
            <span className="text-green-600 font-medium">
              ✓ {signalReceived.length} response
              {signalReceived.length !== 1 ? 's' : ''}
            </span>
            <div className="flex gap-1">
              {signalReceived.map(u => (
                <button
                  key={u.id}
                  onClick={() => onFocusUser(u)}
                  className="rounded-lg bg-gray-100 px-2 py-1 text-xs text-gray-600 hover:bg-gray-200 transition"
                >
                  {u.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        )}

        {signalSent && !pinging && signalReceived?.length === 0 && (
          <span className="text-sm text-gray-400">No responses nearby.</span>
        )}
      </div>
    </div>
  );
}
