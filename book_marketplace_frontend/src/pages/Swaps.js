import React, { useEffect } from "react";
import { useApp } from "../context";
import { api } from "../api";

function Swaps() {
  const { swaps, swapLoading, fetchSwaps, token, user } = useApp();

  useEffect(() => { fetchSwaps(); }, []);

  async function handleRespond(swapId, action) {
    await api.respondSwap(swapId, action, token);
    fetchSwaps();
  }

  return (
    <div className="container" style={{ maxWidth: 800 }}>
      <h2>My Swaps</h2>
      {swapLoading ? <div>Loading...</div> : (
        <div>
          {swaps.length === 0 ? <div>No swaps.</div> : (
            <table className="swaps-table">
              <thead>
                <tr>
                  <th>Book</th>
                  <th>Requester</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {swaps.map(swap =>
                  <tr key={swap.id}>
                    <td>{swap.book_title}</td>
                    <td>{swap.requester_name}</td>
                    <td>{swap.status}</td>
                    <td>
                      {user && swap.owner_id === user.id && swap.status === 'pending' && (
                        <>
                          <button className="btn" onClick={() => handleRespond(swap.id, "accept")}>Accept</button>
                          <button className="btn btn-accent" onClick={() => handleRespond(swap.id, "reject")}>Reject</button>
                        </>
                      )}
                      {user && swap.requester_id === user.id && (
                        <span>{swap.status[0].toUpperCase() + swap.status.slice(1)}</span>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
export default Swaps;
