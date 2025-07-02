import React, { useEffect } from "react";
import { useApp } from "../context";
import { api } from "../api";

function Swaps() {
  const { swaps, swapLoading, fetchSwaps, token, user } = useApp();

  useEffect(() => { fetchSwaps(); }, []);

  // status: pending, accepted, rejected, completed
  async function handleRespond(swapId, status) {
    await api.respondSwap(swapId, status, token);
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
                  <th>Book ID</th>
                  <th>Requester</th>
                  <th>Owner</th>
                  <th>Status</th>
                  <th>Action</th>
                  <th>When</th>
                </tr>
              </thead>
              <tbody>
                {swaps.map(swap =>
                  <tr key={swap.id}>
                    <td>{swap.book_id}</td>
                    <td>{swap.requester_id}</td>
                    <td>{swap.book_owner_id}</td>
                    <td>{swap.status}</td>
                    <td>
                      {user && swap.book_owner_id === user.id && swap.status === 'pending' && (
                        <>
                          <button className="btn" onClick={() => handleRespond(swap.id, "accepted")}>Accept</button>
                          <button className="btn btn-accent" onClick={() => handleRespond(swap.id, "rejected")}>Reject</button>
                        </>
                      )}
                      {user && swap.requester_id === user.id && swap.status === 'accepted' && (
                        <button className="btn btn-accent" onClick={() => handleRespond(swap.id, "completed")}>Mark Complete</button>
                      )}
                      {user && swap.requester_id === user.id && swap.status !== "accepted" && (
                        <span>{swap.status[0].toUpperCase() + swap.status.slice(1)}</span>
                      )}
                    </td>
                    <td>{new Date(swap.updated_at).toLocaleString()}</td>
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
