import React, { useEffect, useState, useContext, useRef } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { AiOutlineUser } from 'react-icons/ai';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserContext } from "../UserContext";
import "./Team.css";

const Team = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userId } = useContext(UserContext);
  const [user, setUser] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("member");
  const [toDeleteMember, setToDeleteMember] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editMember, setEditMember] = useState(null);
  const [editRole, setEditRole] = useState('member');


  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        // Fetch user details to check teamId
        const userRes = await fetch(`https://ticket-management-full-stack.onrender.com/users/getUserDetails/${userId}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!userRes.ok) {
          throw new Error("Failed to fetch user details.");
        }

        const { user } = await userRes.json();
        setUser(user);

        // Fetch team members if teamId exists
        if (user.teamId) {
          const teamRes = await fetch(`https://ticket-management-full-stack.onrender.com/team/getTeamMembers/${user.teamId}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          });

          if (!teamRes.ok) {
            throw new Error("Failed to fetch team members.");
          }

          const teamData = await teamRes.json();

          // Fetch additional details for each team member
          const memberDetailsPromises = teamData.map(async (member) => {
            try {
              const memberRes = await fetch(`https://ticket-management-full-stack.onrender.com/users/getUserDetails/${member.userId._id}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
              });

              if (!memberRes.ok) {
                throw new Error(`Failed to fetch details for user ${member.userId}`);
              }

              const memberData = await memberRes.json();
              return {
                id: memberData.user.id,
                name: memberData.user.username,
                email: memberData.user.email,
                role: memberData.user.role,
                phone: memberData.user.phone || '+1 (000) 000-0000', 
              };
            } catch (err) {
              console.error(`Failed to fetch user ${member.userId}:`, err);
              return null;
            }
          });

          const resolvedMembers = await Promise.all(memberDetailsPromises);
          setTeamMembers(resolvedMembers.filter(Boolean)); // Filter out null values
        }
      } catch (error) {
        console.error('Error fetching team members:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, [userId]);

   // ↓ Add member handler
  const handleAddMember = async () => {
      try {
        if (user.role === 'member') {
          toast.error('You are unauthorized to add members.');
          return;
        }
        const res = await fetch('https://ticket-management-full-stack.onrender.com/team/addMember', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            username: newUsername,
            email: newEmail,
            role: newRole
          })
        });
        if (!res.ok) throw new Error('Add failed');
        const { team } = await res.json();
        // append new member to UI
        const m = team.members.slice(-1)[0];
        setTeamMembers(prev => [
          ...prev,
          { id: m.userId, name: newUsername, email: newEmail, role: newRole, phone: '+1 (000) 000-0000' }
        ]);
        setShowAddModal(false);
        setNewUsername('');
        setNewEmail('');
        setNewRole('member');
        toast.success('Member added successfully!');
      } catch (e) {
        console.error(e);
        alert('Could not add member');
      }
    };
  
    // ↓ Delete handler
    const handleConfirmDelete = async () => {
      if (user.role === 'member') {
        toast.error('You are unauthorized to delete members.');
        return;
      }
      console.log('Deleting member ID:', toDeleteMember.id);
      console.log('Deleting member team ID:', user.teamId);
      try {
        const res = await fetch(`https://ticket-management-full-stack.onrender.com/team/removeMember/${user.teamId}`, {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ userId: toDeleteMember.id })
        });
        if (!res.ok) throw new Error('Delete failed');
        setTeamMembers(prev => prev.filter(m => m.id !== toDeleteMember.id));
        setShowDeleteModal(false);
        setToDeleteMember(null);
        toast.success('Member removed successfully!');
      } catch (e) {
        console.error(e);
        toast.error('Could not remove member.');
      }
    };
  return (
    <div className="p-6">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4">Team</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto shadow rounded-lg">
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-2">Full Name</th>
                <th className="text-left px-4 py-2">Phone</th>
                <th className="text-left px-4 py-2">Email</th>
                <th className="text-left px-4 py-2">Role</th>
                <th className="text-left px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map((member) => (
                <tr key={member.id} className="border-b">
                  <td className="px-4 py-2 flex items-center gap-2">
                    <AiOutlineUser className="w-6 h-6 text-gray-600" />
                    {member.name}
                  </td>
                  <td className="px-4 py-2">{member.phone}</td>
                  <td className="px-4 py-2">{member.email}</td>
                  <td className="px-4 py-2 capitalize">
                    {member.role === 'member' ? 'Member':'Admin' }
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                  <button
                      onClick={() => {
                        setEditMember(member);
                        setEditRole(member.role);
                        setShowEditModal(true);
                      }}>
                      <FaEdit className="text-blue-500 hover:text-blue-700" />
                    </button>
                    <button onClick={() => { setToDeleteMember(member); setShowDeleteModal(true); }}>
                      <FaTrash className="text-red-500 hover:text-red-700" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end mt-4">
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={() => setShowAddModal(true)}>
              + Add Team members
            </button>
          </div>
        </div>
      )}
      {/* ——— Add Member Modal ——— */}
      {showAddModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>Add Team members</h2>
            <p className="modal-note">
              Talk with colleagues in a group chat. Messages in this group are only visible to its participants. New teammates may only be invited by the administrators.
            </p>
           <label>User name</label>
            <input
              type="text"
              placeholder="User name"
              value={newUsername}
              onChange={e => setNewUsername(e.target.value)}
            />
            <label>Email ID</label>
            <input
              type="email"
              placeholder="Email ID"
              value={newEmail}
              onChange={e => setNewEmail(e.target.value)}
            />
            <label>Designation</label>
            <select value={newRole} onChange={e => setNewRole(e.target.value)}>
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="btn-save" onClick={handleAddMember}>Save</button>
           </div>
          </div>
        </div>
      )}

      {/* ——— Delete Confirmation Modal ——— */}
      {showDeleteModal && (
        <div className="modal-backdrop">
          <div className="modal small">
            <p>This teammate will be deleted.</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button className="btn-save" onClick={handleConfirmDelete}>Confirm</button>
            </div>
          </div>
       </div>
      )}
     {/* ——— Edit Role Modal ——— */}
    {showEditModal && (
      <div className="modal-backdrop">
        <div className="modal">
          <h2>Edit Role</h2>
          <label>Designation</label>
          <select
            value={editRole}
            onChange={e => setEditRole(e.target.value)}
          >
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
          <div className="modal-actions">
            <button
              className="btn-cancel"
              onClick={() => setShowEditModal(false)}
            >
              Cancel
            </button>
            <button
              className="btn-save"
              onClick={async () => {
                if (user.role === 'member') {
                  toast.error('You are unauthorized to edit members.');
                  return;
                }
                const res = await fetch(
                  `https://ticket-management-full-stack.onrender.com/team/updateMemberRole/${user.teamId}`,
                  {
                    method: 'PUT',
                    credentials: 'include',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                      userId: editMember.id,
                      role: editRole
                    })
                  }
                );
                if (!res.ok) return toast.error('Could not update member role.');
                // update local state
                setTeamMembers(ms =>
                  ms.map(m =>
                    m.id === editMember.id ? { ...m, role: editRole } : m
                  )
                );
                setShowEditModal(false);
                setEditMember(null);
              }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    )}
    </div>
  );
};

export default Team;
