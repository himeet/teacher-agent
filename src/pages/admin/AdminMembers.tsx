import { useState } from 'react';
import { Search, Filter, Download, Plus, MoreHorizontal } from 'lucide-react';
import { adminMembers } from '@/data/mockData';
import * as TaroCompat from '@/components/TaroCompat';

export default function AdminMembers() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filtered = adminMembers.filter(m => {
    const matchSearch = !search || m.name.includes(search) || m.phone.includes(search);
    const matchStatus = statusFilter === 'all' || m.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map(f => f.id));
    }
  };

  return (
    <TaroCompat.Div className="p-6 space-y-4">
      {/* Header */}
      <TaroCompat.Div className="flex items-center justify-between">
        <TaroCompat.H1 className="text-xl font-bold text-gray-800">学员管理</TaroCompat.H1>
        <TaroCompat.Div className="flex items-center gap-2">
          <TaroCompat.ButtonCompat className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            <Download size={14} />
            导出
          </TaroCompat.ButtonCompat>
          <TaroCompat.ButtonCompat className="flex items-center gap-1.5 px-3 py-2 bg-[#2D5AF5] text-white rounded-lg text-sm hover:bg-[#2548C8]">
            <Plus size={14} />
            新增学员
          </TaroCompat.ButtonCompat>
        </TaroCompat.Div>
      </TaroCompat.Div>

      {/* Filters */}
      <TaroCompat.Div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100">
        <TaroCompat.Div className="flex-1 relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <TaroCompat.CompatInput
            value={search}
            onChange={(e: any) => setSearch(e.target.value)}
            placeholder="搜索姓名、手机号..."
            className="w-full pl-9 pr-4 py-2 bg-gray-50 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#2D5AF5]/20"
          />
        </TaroCompat.Div>
        <TaroCompat.SelectCompat
          value={statusFilter}
          onChange={(e: any) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-gray-50 rounded-lg text-sm outline-none border-none"
        >
          <TaroCompat.OptionCompat value="all">全部状态</TaroCompat.OptionCompat>
          <TaroCompat.OptionCompat value="active">活跃</TaroCompat.OptionCompat>
          <TaroCompat.OptionCompat value="frozen">冻结</TaroCompat.OptionCompat>
          <TaroCompat.OptionCompat value="inactive">未激活</TaroCompat.OptionCompat>
        </TaroCompat.SelectCompat>
        <TaroCompat.ButtonCompat className="p-2 bg-gray-50 rounded-lg text-gray-400 hover:text-gray-600">
          <Filter size={16} />
        </TaroCompat.ButtonCompat>
      </TaroCompat.Div>

      {/* Batch Actions */}
      {selectedIds.length > 0 && (
        <TaroCompat.Div className="flex items-center gap-2 bg-[#E8EFFD] px-4 py-2 rounded-lg">
          <TaroCompat.Span className="text-sm text-[#2D5AF5]">已选择 {selectedIds.length} 人</TaroCompat.Span>
          <TaroCompat.ButtonCompat className="text-xs bg-white text-gray-600 px-3 py-1.5 rounded-lg ml-2">批量冻结</TaroCompat.ButtonCompat>
          <TaroCompat.ButtonCompat className="text-xs bg-white text-gray-600 px-3 py-1.5 rounded-lg">批量调整限额</TaroCompat.ButtonCompat>
        </TaroCompat.Div>
      )}

      {/* Table */}
      <TaroCompat.Div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <TaroCompat.Table className="w-full text-sm">
          <TaroCompat.Thead>
            <TaroCompat.Tr className="bg-gray-50 border-b border-gray-100">
              <TaroCompat.Th className="px-4 py-3 text-left w-10">
                <TaroCompat.CompatInput
                  type="checkbox"
                  checked={selectedIds.length === filtered.length && filtered.length > 0}
                  onChange={toggleAll}
                  className="rounded"
                />
              </TaroCompat.Th>
              <TaroCompat.Th className="px-4 py-3 text-left font-medium text-gray-600">姓名</TaroCompat.Th>
              <TaroCompat.Th className="px-4 py-3 text-left font-medium text-gray-600">部门/岗位</TaroCompat.Th>
              <TaroCompat.Th className="px-4 py-3 text-left font-medium text-gray-600">月积分</TaroCompat.Th>
              <TaroCompat.Th className="px-4 py-3 text-left font-medium text-gray-600">学习时长</TaroCompat.Th>
              <TaroCompat.Th className="px-4 py-3 text-left font-medium text-gray-600">最近登录</TaroCompat.Th>
              <TaroCompat.Th className="px-4 py-3 text-left font-medium text-gray-600">状态</TaroCompat.Th>
              <TaroCompat.Th className="px-4 py-3 text-left font-medium text-gray-600 w-10"></TaroCompat.Th>
            </TaroCompat.Tr>
          </TaroCompat.Thead>
          <TaroCompat.Tbody className="divide-y divide-gray-50">
            {filtered.map(m => (
              <TaroCompat.Tr key={m.id} className="hover:bg-gray-50/50">
                <TaroCompat.Td className="px-4 py-3">
                  <TaroCompat.CompatInput
                    type="checkbox"
                    checked={selectedIds.includes(m.id)}
                    onChange={() => toggleSelect(m.id)}
                    className="rounded"
                  />
                </TaroCompat.Td>
                <TaroCompat.Td className="px-4 py-3">
                  <TaroCompat.Div className="flex items-center gap-2">
                    <TaroCompat.Div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                      {m.name[0]}
                    </TaroCompat.Div>
                    <TaroCompat.Div>
                      <TaroCompat.P className="text-sm text-gray-800">{m.name}</TaroCompat.P>
                      <TaroCompat.P className="text-xs text-gray-400">{m.phone}</TaroCompat.P>
                    </TaroCompat.Div>
                  </TaroCompat.Div>
                </TaroCompat.Td>
                <TaroCompat.Td className="px-4 py-3">
                  <TaroCompat.P className="text-sm text-gray-700">{m.department}</TaroCompat.P>
                  <TaroCompat.P className="text-xs text-gray-400">{m.jobTitle}</TaroCompat.P>
                </TaroCompat.Td>
                <TaroCompat.Td className="px-4 py-3">
                  <TaroCompat.P className="text-sm text-gray-700">{m.monthlyUsed}/{m.monthlyLimit}</TaroCompat.P>
                  <TaroCompat.Div className="w-16 h-1 bg-gray-100 rounded-full mt-1">
                    <TaroCompat.Div className="h-full bg-[#2D5AF5] rounded-full" style={{ width: `${(m.monthlyUsed / m.monthlyLimit) * 100}%` }} />
                  </TaroCompat.Div>
                </TaroCompat.Td>
                <TaroCompat.Td className="px-4 py-3 text-gray-700">{m.studyHours}h</TaroCompat.Td>
                <TaroCompat.Td className="px-4 py-3 text-gray-500">{m.lastLogin || '未登录'}</TaroCompat.Td>
                <TaroCompat.Td className="px-4 py-3">
                  <TaroCompat.Span className={`text-xs px-2 py-0.5 rounded-full ${
                    m.status === 'active' ? 'bg-emerald-50 text-emerald-600' :
                    m.status === 'frozen' ? 'bg-red-50 text-red-500' :
                    'bg-gray-100 text-gray-500'
                  }`}>
                    {m.status === 'active' ? '活跃' : m.status === 'frozen' ? '冻结' : '未激活'}
                  </TaroCompat.Span>
                </TaroCompat.Td>
                <TaroCompat.Td className="px-4 py-3">
                  <TaroCompat.ButtonCompat className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal size={16} />
                  </TaroCompat.ButtonCompat>
                </TaroCompat.Td>
              </TaroCompat.Tr>
            ))}
          </TaroCompat.Tbody>
        </TaroCompat.Table>
        {filtered.length === 0 && (
          <TaroCompat.Div className="text-center py-12 text-gray-400 text-sm">没有找到匹配的学员</TaroCompat.Div>
        )}
      </TaroCompat.Div>
    </TaroCompat.Div>
  );
}
