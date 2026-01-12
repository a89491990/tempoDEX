import React, { useState } from 'react';
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

const TokenSearch = ({ onAddToken, loading }) => {
  const [address, setAddress] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!address.trim()) {
      toast.error('Please enter a token address');
      return;
    }

    const success = await onAddToken(address);
    if (success) {
      setAddress('');
      toast.success('Token added successfully!');
    }
  };

  return (
    <div className="card glass-effect shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-2xl">
          <MagnifyingGlassIcon className="h-6 w-6" />
          Add Token by Contract Address
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Token Contract Address</span>
            </label>
            <input
              type="text"
              placeholder="0x..."
              className="input input-bordered w-full"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              <>
                <PlusIcon className="h-5 w-5" />
                Add Token
              </>
            )}
          </button>
        </form>

        <div className="mt-4 text-sm text-gray-500">
          <p>💡 Tip: You can find test token addresses on Tempo Testnet explorer</p>
        </div>
      </div>
    </div>
  );
};

export default TokenSearch;