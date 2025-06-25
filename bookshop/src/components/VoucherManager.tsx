import React, { useState, useEffect } from 'react';
import { voucherService, authService } from '../utils/api';

interface Voucher {
  voucherCode: string;
  voucherPrice: number;
  purchaseDate: string;
  expiryDate: string;
  isExpired: boolean;
}

const VoucherManager: React.FC = () => {
  const [activeVouchers, setActiveVouchers] = useState<Voucher[]>([]);
  const [expiredVouchers, setExpiredVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [voucherPrice, setVoucherPrice] = useState<number>(50);
  const [voucherCode, setVoucherCode] = useState('');

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setIsLoggedIn(true);
      fetchVouchers();
    }
  }, []);

  const fetchVouchers = async () => {
    try {
      setLoading(true);
      
      const activeResponse = await voucherService.getActiveVouchers();
      setActiveVouchers(activeResponse.data.data);
      
      const expiredResponse = await voucherService.getExpiredVouchers();
      setExpiredVouchers(expiredResponse.data.data);
    } catch (error) {
      console.error('Error fetching vouchers:', error);
      setError('Failed to load vouchers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const createVoucher = async () => {
    if (!isLoggedIn) {
      setError('Please log in to create a voucher');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      const response = await voucherService.createVoucher(voucherPrice);
      setSuccess(`Voucher created successfully! Your code is: ${response.data.data.voucherCode}`);
      
      fetchVouchers();
    } catch (error) {
      console.error('Error creating voucher:', error);
      setError('Failed to create voucher. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const applyVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!voucherCode) {
      setError('Please enter a voucher code');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      const response = await voucherService.applyVoucher(voucherCode);
      setSuccess(`Voucher applied successfully! Amount: $${response.data.data.voucherPrice.toFixed(2)}`);
      setVoucherCode('');
      
      fetchVouchers();
    } catch (error) {
      console.error('Error applying voucher:', error);
      setError('Invalid or expired voucher code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (!isLoggedIn) {
    return (
      <div className="voucher-container">
        <h2>Gift Vouchers</h2>
        <p>Please <a href="/login">log in</a> to manage your vouchers.</p>
      </div>
    );
  }

  return (
    <div className="voucher-container">
      <h2>Gift Vouchers</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      {loading ? (
        <div className="loading">Loading vouchers...</div>
      ) : (
        <>
          <div className="voucher-actions">
            <div className="create-voucher">
              <h3>Purchase a Gift Voucher</h3>
              <div className="voucher-form">
                <label htmlFor="voucherPrice">Voucher Amount ($):</label>
                <select 
                  id="voucherPrice" 
                  value={voucherPrice} 
                  onChange={(e) => setVoucherPrice(Number(e.target.value))}
                >
                  <option value="25">$25</option>
                  <option value="50">$50</option>
                  <option value="100">$100</option>
                  <option value="200">$200</option>
                </select>
                <button 
                  className="create-voucher-button" 
                  onClick={createVoucher}
                  disabled={loading}
                >
                  Purchase Voucher
                </button>
              </div>
            </div>
            
            <div className="apply-voucher">
              <h3>Apply a Voucher</h3>
              <form onSubmit={applyVoucher}>
                <div className="voucher-form">
                  <label htmlFor="voucherCode">Voucher Code:</label>
                  <input 
                    type="text" 
                    id="voucherCode" 
                    value={voucherCode} 
                    onChange={(e) => setVoucherCode(e.target.value)}
                    placeholder="Enter voucher code" 
                    required
                  />
                  <button 
                    type="submit" 
                    className="apply-voucher-button"
                    disabled={loading}
                  >
                    Apply Voucher
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          <div className="voucher-lists">
            <div className="active-vouchers">
              <h3>Active Vouchers</h3>
              {activeVouchers.length === 0 ? (
                <p>You don't have any active vouchers.</p>
              ) : (
                <table className="voucher-table">
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Amount</th>
                      <th>Purchase Date</th>
                      <th>Expiry Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeVouchers.map((voucher, index) => (
                      <tr key={index}>
                        <td>{voucher.voucherCode}</td>
                        <td>${voucher.voucherPrice.toFixed(2)}</td>
                        <td>{formatDate(voucher.purchaseDate)}</td>
                        <td>{formatDate(voucher.expiryDate)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            
            <div className="expired-vouchers">
              <h3>Expired Vouchers</h3>
              {expiredVouchers.length === 0 ? (
                <p>You don't have any expired vouchers.</p>
              ) : (
                <table className="voucher-table">
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Amount</th>
                      <th>Purchase Date</th>
                      <th>Expiry Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expiredVouchers.map((voucher, index) => (
                      <tr key={index} className="expired">
                        <td>{voucher.voucherCode}</td>
                        <td>${voucher.voucherPrice.toFixed(2)}</td>
                        <td>{formatDate(voucher.purchaseDate)}</td>
                        <td>{formatDate(voucher.expiryDate)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VoucherManager; 