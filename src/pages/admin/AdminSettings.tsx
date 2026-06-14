import { useState } from 'react';
import { Building2, CreditCard, Users, Bell, Shield, Save } from 'lucide-react';
import * as TaroCompat from '@/components/TaroCompat';

export default function AdminSettings() {
  const [activeSection, setActiveSection] = useState('enterprise');

  const sections = [
    { key: 'enterprise', label: '企业信息', icon: Building2 },
    { key: 'credits', label: '积分管理', icon: CreditCard },
    { key: 'members', label: '子账号设置', icon: Users },
    { key: 'notifications', label: '通知模板', icon: Bell },
    { key: 'permissions', label: '权限管理', icon: Shield },
  ];

  return (
    <TaroCompat.Div className="p-6 flex gap-6">
      {/* Sidebar */}
      <TaroCompat.Div className="w-48 shrink-0 space-y-1">
        {sections.map(s => (
          <TaroCompat.ButtonCompat
            key={s.key}
            onClick={() => setActiveSection(s.key)}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all ${
              activeSection === s.key
                ? 'bg-[#E8EFFD] text-[#2D5AF5] font-medium'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <s.icon size={16} />
            {s.label}
          </TaroCompat.ButtonCompat>
        ))}
      </TaroCompat.Div>

      {/* Content */}
      <TaroCompat.Div className="flex-1 bg-white rounded-xl p-6 border border-gray-100">
        {activeSection === 'enterprise' && (
          <TaroCompat.Div className="space-y-4 max-w-lg">
            <TaroCompat.H3 className="text-base font-semibold text-gray-800">企业信息</TaroCompat.H3>
            <TaroCompat.Div>
              <TaroCompat.Label className="text-sm text-gray-600 mb-1 block">企业名称</TaroCompat.Label>
              <TaroCompat.CompatInput defaultValue="美齿口腔连锁" className="w-full px-4 py-2.5 bg-gray-50 rounded-lg text-sm outline-none border border-gray-200" />
            </TaroCompat.Div>
            <TaroCompat.Div>
              <TaroCompat.Label className="text-sm text-gray-600 mb-1 block">所属行业</TaroCompat.Label>
              <TaroCompat.CompatInput defaultValue="口腔医疗服务" className="w-full px-4 py-2.5 bg-gray-50 rounded-lg text-sm outline-none border border-gray-200" />
            </TaroCompat.Div>
            <TaroCompat.Div>
              <TaroCompat.Label className="text-sm text-gray-600 mb-1 block">企业规模</TaroCompat.Label>
              <TaroCompat.SelectCompat className="w-full px-4 py-2.5 bg-gray-50 rounded-lg text-sm outline-none border border-gray-200">
                <TaroCompat.OptionCompat>10-50人</TaroCompat.OptionCompat>
                <TaroCompat.OptionCompat>50-200人</TaroCompat.OptionCompat>
                <TaroCompat.OptionCompat>200人以上</TaroCompat.OptionCompat>
              </TaroCompat.SelectCompat>
            </TaroCompat.Div>
            <TaroCompat.Div>
              <TaroCompat.Label className="text-sm text-gray-600 mb-1 block">管理员</TaroCompat.Label>
              <TaroCompat.Div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 rounded-lg">
                <TaroCompat.Img src="/images/admin_avatar.jpg" alt="admin" className="w-6 h-6 rounded-full" />
                <TaroCompat.Span className="text-sm text-gray-700">李管理者</TaroCompat.Span>
              </TaroCompat.Div>
            </TaroCompat.Div>
          </TaroCompat.Div>
        )}

        {activeSection === 'credits' && (
          <TaroCompat.Div className="space-y-4 max-w-lg">
            <TaroCompat.H3 className="text-base font-semibold text-gray-800">积分管理</TaroCompat.H3>
            <TaroCompat.Div className="bg-[#E8EFFD] rounded-xl p-4">
              <TaroCompat.P className="text-sm text-gray-600">当前积分池余额</TaroCompat.P>
              <TaroCompat.P className="text-2xl font-bold text-[#2D5AF5] mt-1">28,600</TaroCompat.P>
              <TaroCompat.Div className="flex gap-4 mt-2 text-xs text-gray-500">
                <TaroCompat.Span>总充值：50,000</TaroCompat.Span>
                <TaroCompat.Span>总消耗：21,400</TaroCompat.Span>
              </TaroCompat.Div>
            </TaroCompat.Div>
            <TaroCompat.Div>
              <TaroCompat.Label className="text-sm text-gray-600 mb-1 block">充值金额</TaroCompat.Label>
              <TaroCompat.Div className="flex gap-2">
                {['1000', '5000', '10000', '20000'].map(amt => (
                  <TaroCompat.ButtonCompat key={amt} className="flex-1 py-2.5 bg-gray-50 rounded-lg text-sm text-gray-700 hover:bg-[#E8EFFD] hover:text-[#2D5AF5] transition-all border border-gray-200">
                    {amt}元
                  </TaroCompat.ButtonCompat>
                ))}
              </TaroCompat.Div>
            </TaroCompat.Div>
          </TaroCompat.Div>
        )}

        {activeSection === 'members' && (
          <TaroCompat.Div className="space-y-4 max-w-lg">
            <TaroCompat.H3 className="text-base font-semibold text-gray-800">子账号全局设置</TaroCompat.H3>
            <TaroCompat.Div>
              <TaroCompat.Label className="text-sm text-gray-600 mb-1 block">默认月积分限额</TaroCompat.Label>
              <TaroCompat.CompatInput type="number" defaultValue={500} className="w-full px-4 py-2.5 bg-gray-50 rounded-lg text-sm outline-none border border-gray-200" />
            </TaroCompat.Div>
            <TaroCompat.Div className="flex items-center justify-between py-3 border-b border-gray-50">
              <TaroCompat.Div>
                <TaroCompat.P className="text-sm text-gray-700">新账号自动加入默认培训计划</TaroCompat.P>
                <TaroCompat.P className="text-xs text-gray-400">开启后新创建的子账号将自动加入当前进行中的培训计划</TaroCompat.P>
              </TaroCompat.Div>
              <TaroCompat.ButtonCompat className="w-10 h-6 bg-[#2D5AF5] rounded-full relative">
                <TaroCompat.Span className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow" />
              </TaroCompat.ButtonCompat>
            </TaroCompat.Div>
            <TaroCompat.Div className="flex items-center justify-between py-3">
              <TaroCompat.Div>
                <TaroCompat.P className="text-sm text-gray-700">仅允许企业微信登录</TaroCompat.P>
                <TaroCompat.P className="text-xs text-gray-400">开启后子账号只能通过企业微信扫码登录</TaroCompat.P>
              </TaroCompat.Div>
              <TaroCompat.ButtonCompat className="w-10 h-6 bg-gray-200 rounded-full relative">
                <TaroCompat.Span className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow" />
              </TaroCompat.ButtonCompat>
            </TaroCompat.Div>
          </TaroCompat.Div>
        )}

        {activeSection === 'notifications' && (
          <TaroCompat.Div className="space-y-4 max-w-lg">
            <TaroCompat.H3 className="text-base font-semibold text-gray-800">通知模板设置</TaroCompat.H3>
            <TaroCompat.Div>
              <TaroCompat.Label className="text-sm text-gray-600 mb-1 block">培训计划下发通知</TaroCompat.Label>
              <TaroCompat.CompatTextarea
                defaultValue={`您有新的培训计划「{plan_name}」待完成，请在 {end_date} 前完成学习。`}
                rows={3}
                className="w-full px-4 py-2.5 bg-gray-50 rounded-lg text-sm outline-none border border-gray-200 resize-none"
              />
            </TaroCompat.Div>
            <TaroCompat.Div>
              <TaroCompat.Label className="text-sm text-gray-600 mb-1 block">学习催办频率</TaroCompat.Label>
              <TaroCompat.SelectCompat className="w-full px-4 py-2.5 bg-gray-50 rounded-lg text-sm outline-none border border-gray-200">
                <TaroCompat.OptionCompat>每天</TaroCompat.OptionCompat>
                <TaroCompat.OptionCompat>每3天</TaroCompat.OptionCompat>
                <TaroCompat.OptionCompat>每周</TaroCompat.OptionCompat>
              </TaroCompat.SelectCompat>
            </TaroCompat.Div>
            <TaroCompat.Div>
              <TaroCompat.Label className="text-sm text-gray-600 mb-1 block">积分不足提醒阈值</TaroCompat.Label>
              <TaroCompat.CompatInput type="number" defaultValue={50} className="w-full px-4 py-2.5 bg-gray-50 rounded-lg text-sm outline-none border border-gray-200" />
              <TaroCompat.P className="text-xs text-gray-400 mt-1">当学员积分低于此值时发送提醒</TaroCompat.P>
            </TaroCompat.Div>
          </TaroCompat.Div>
        )}

        {activeSection === 'permissions' && (
          <TaroCompat.Div className="space-y-4 max-w-lg">
            <TaroCompat.H3 className="text-base font-semibold text-gray-800">权限管理</TaroCompat.H3>
            <TaroCompat.Div className="space-y-2">
              {[
                { name: '李管理者', role: '主管理员', email: 'admin@meichi.com' },
                { name: '王副管', role: '副管理员', email: 'sub@meichi.com' },
              ].map(admin => (
                <TaroCompat.Div key={admin.name} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <TaroCompat.Div className="w-8 h-8 bg-[#2D5AF5] rounded-full flex items-center justify-center text-white text-xs">
                    {admin.name[0]}
                  </TaroCompat.Div>
                  <TaroCompat.Div className="flex-1">
                    <TaroCompat.P className="text-sm text-gray-800">{admin.name}</TaroCompat.P>
                    <TaroCompat.P className="text-xs text-gray-400">{admin.email}</TaroCompat.P>
                  </TaroCompat.Div>
                  <TaroCompat.Span className="text-xs bg-[#E8EFFD] text-[#2D5AF5] px-2 py-0.5 rounded-full">{admin.role}</TaroCompat.Span>
                </TaroCompat.Div>
              ))}
            </TaroCompat.Div>
          </TaroCompat.Div>
        )}

        <TaroCompat.Div className="mt-6 flex justify-end">
          <TaroCompat.ButtonCompat className="flex items-center gap-1.5 px-4 py-2 bg-[#2D5AF5] text-white rounded-lg text-sm hover:bg-[#2548C8]">
            <Save size={14} />
            保存设置
          </TaroCompat.ButtonCompat>
        </TaroCompat.Div>
      </TaroCompat.Div>
    </TaroCompat.Div>
  );
}
