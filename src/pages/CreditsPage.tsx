import { useApp } from '@/context/AppContext';
import { ArrowLeft, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import * as TaroCompat from '@/components/TaroCompat';

export default function CreditsPage() {
  const { goBack, user, creditTransactions, showToast, addCreditTransaction } = useApp();

  const handleRecharge = (amount: number, credits: number) => {
    const newBalance = (user.creditBalance || 0) + credits;
    addCreditTransaction({
      id: `tx_recharge_${Date.now()}`,
      type: 'income',
      amount: credits,
      source: `积分充值 ${amount}元`,
      createdAt: new Date().toLocaleString('zh-CN'),
      balance: newBalance,
    });
    showToast(`成功充值 ${credits} 积分`, 'success');
  };

  return (
    <TaroCompat.Div className="min-h-full bg-[#F4F6F8]">
      {/* Header */}
      <TaroCompat.Div className="sticky top-0 bg-white z-10 flex items-center px-4 py-3 border-b border-gray-100">
        <TaroCompat.ButtonCompat onClick={goBack} className="w-8 h-8 flex items-center justify-center -ml-2">
          <ArrowLeft size={20} className="text-gray-700" />
        </TaroCompat.ButtonCompat>
        <TaroCompat.H1 className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <TaroCompat.Span className="text-base font-semibold text-gray-800">积分中心</TaroCompat.Span>
        </TaroCompat.H1>
      </TaroCompat.Div>

      {/* Balance Card */}
      <TaroCompat.Div className="mx-4 mt-4 bg-gradient-to-br from-[#2D5AF5] to-[#6B8EF7] rounded-2xl p-6 text-white">
        <TaroCompat.P className="text-sm text-white/70 mb-1">
          {user.role === 'enterprise_member' ? '企业积分余额' : '我的积分'}
        </TaroCompat.P>
        <TaroCompat.P className="text-4xl font-bold font-mono">{user.creditBalance?.toLocaleString()}</TaroCompat.P>
        {user.role === 'enterprise_member' && (
          <TaroCompat.P className="text-xs text-white/60 mt-2">本月限额：{user.monthlyLimit}积分</TaroCompat.P>
        )}
      </TaroCompat.Div>

      {/* Membership Card */}
      <TaroCompat.Div className="mx-4 mt-4 bg-white rounded-xl p-4 shadow-sm">
        <TaroCompat.Div className="flex items-center justify-between mb-3">
          <TaroCompat.H3 className="text-sm font-semibold text-gray-800">会员状态</TaroCompat.H3>
          <TaroCompat.Span className="text-xs bg-[#E8EFFD] text-[#2D5AF5] px-2 py-0.5 rounded-full">
            {user.membership === 'enterprise' ? '企业版' : user.membership}
          </TaroCompat.Span>
        </TaroCompat.Div>
        <TaroCompat.P className="text-xs text-gray-500">有效期至 {user.membershipExpiry}</TaroCompat.P>
        <TaroCompat.Div className="mt-3 flex gap-2">
          {user.membership !== 'enterprise' && (
            <TaroCompat.ButtonCompat className="flex-1 bg-[#2D5AF5] text-white text-xs py-2.5 rounded-xl font-medium">
              升级企业版
            </TaroCompat.ButtonCompat>
          )}
          {user.membership === 'enterprise' && (
            <TaroCompat.ButtonCompat className="flex-1 bg-gray-100 text-gray-600 text-xs py-2.5 rounded-xl font-medium">
              企业版续费
            </TaroCompat.ButtonCompat>
          )}
        </TaroCompat.Div>
      </TaroCompat.Div>

      {/* Recharge Options */}
      <TaroCompat.Div className="mx-4 mt-4 bg-white rounded-xl p-4 shadow-sm">
        <TaroCompat.H3 className="text-sm font-semibold text-gray-800 mb-3">积分充值</TaroCompat.H3>
        <TaroCompat.Div className="grid grid-cols-3 gap-3">
          {[
            { amount: 50, credits: 500 },
            { amount: 100, credits: 1000 },
            { amount: 500, credits: 5000 },
          ].map(opt => (
            <TaroCompat.ButtonCompat
              key={opt.amount}
              onClick={() => handleRecharge(opt.amount, opt.credits)}
              className="border border-gray-200 rounded-xl p-3 text-center hover:border-[#2D5AF5] hover:bg-[#E8EFFD] transition-all"
            >
              <TaroCompat.P className="text-lg font-bold text-gray-800">{opt.amount}元</TaroCompat.P>
              <TaroCompat.P className="text-xs text-[#2D5AF5] mt-0.5">{opt.credits}积分</TaroCompat.P>
            </TaroCompat.ButtonCompat>
          ))}
        </TaroCompat.Div>
        <TaroCompat.P className="text-xs text-gray-400 mt-3 text-center">1元 = 10积分 · 微信支付</TaroCompat.P>
      </TaroCompat.Div>

      {/* Transactions */}
      <TaroCompat.Div className="mx-4 mt-4 bg-white rounded-xl p-4 shadow-sm mb-4">
        <TaroCompat.H3 className="text-sm font-semibold text-gray-800 mb-3">收支明细</TaroCompat.H3>
        <TaroCompat.Div className="space-y-3">
          {creditTransactions.slice(0, 10).map(tx => (
            <TaroCompat.Div key={tx.id} className="flex items-center gap-3">
              <TaroCompat.Div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                tx.type === 'income' ? 'bg-emerald-50' : 'bg-red-50'
              }`}>
                {tx.type === 'income'
                  ? <ArrowDownRight size={14} className="text-emerald-500" />
                  : <ArrowUpRight size={14} className="text-red-500" />
                }
              </TaroCompat.Div>
              <TaroCompat.Div className="flex-1 min-w-0">
                <TaroCompat.P className="text-sm text-gray-800 truncate">{tx.source}</TaroCompat.P>
                <TaroCompat.P className="text-xs text-gray-400">{tx.createdAt}</TaroCompat.P>
              </TaroCompat.Div>
              <TaroCompat.Div className="text-right shrink-0">
                <TaroCompat.P className={`text-sm font-medium ${tx.type === 'income' ? 'text-emerald-600' : 'text-red-500'}`}>
                  {tx.type === 'income' ? '+' : ''}{tx.amount}
                </TaroCompat.P>
                <TaroCompat.P className="text-xs text-gray-400">{tx.balance}</TaroCompat.P>
              </TaroCompat.Div>
            </TaroCompat.Div>
          ))}
        </TaroCompat.Div>
      </TaroCompat.Div>
    </TaroCompat.Div>
  );
}
