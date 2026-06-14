import { useApp } from '@/context/AppContext';
import { ArrowLeft, CheckCircle, Plus, Users, BookOpen } from 'lucide-react';
import { instructors } from '@/data/mockData';
import * as TaroCompat from '@/components/TaroCompat';

export default function InstructorsPage() {
  const { goBack, showToast } = useApp();

  const handleAdd = (inst: typeof instructors[0]) => {
    showToast(`已添加导师：${inst.name}`, 'success');
  };

  return (
    <TaroCompat.Div className="min-h-full bg-[#F4F6F8]">
      {/* Header */}
      <TaroCompat.Div className="sticky top-0 bg-white z-10 flex items-center px-4 py-3 border-b border-gray-100">
        <TaroCompat.ButtonCompat onClick={goBack} className="w-8 h-8 flex items-center justify-center -ml-2">
          <ArrowLeft size={20} className="text-gray-700" />
        </TaroCompat.ButtonCompat>
        <TaroCompat.H1 className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <TaroCompat.Span className="text-base font-semibold text-gray-800">我的导师</TaroCompat.Span>
        </TaroCompat.H1>
      </TaroCompat.Div>

      <TaroCompat.Div className="p-4 space-y-4">
        {/* My Instructors */}
        <TaroCompat.Div>
          <TaroCompat.H3 className="text-sm font-semibold text-gray-800 mb-3">已购导师</TaroCompat.H3>
          {instructors.filter(i => i.isPurchased).map(inst => (
            <TaroCompat.Div key={inst.id} className="bg-white rounded-xl p-4 shadow-sm mb-3">
              <TaroCompat.Div className="flex items-center gap-3">
                <TaroCompat.Img src={inst.avatar} alt={inst.name} className="w-14 h-14 rounded-full object-cover" />
                <TaroCompat.Div className="flex-1">
                  <TaroCompat.Div className="flex items-center gap-2">
                    <TaroCompat.P className="text-base font-semibold text-gray-800">{inst.name}</TaroCompat.P>
                    <CheckCircle size={14} className="text-emerald-500" />
                  </TaroCompat.Div>
                  <TaroCompat.P className="text-xs text-gray-500">{inst.title}</TaroCompat.P>
                  <TaroCompat.P className="text-xs text-gray-400 mt-1">{inst.specialty} · {inst.courses}门课程</TaroCompat.P>
                </TaroCompat.Div>
              </TaroCompat.Div>
              <TaroCompat.P className="text-xs text-gray-600 mt-3 leading-relaxed">{inst.description}</TaroCompat.P>
            </TaroCompat.Div>
          ))}
        </TaroCompat.Div>

        {/* Available Instructors */}
        <TaroCompat.Div>
          <TaroCompat.H3 className="text-sm font-semibold text-gray-800 mb-3">可添加导师</TaroCompat.H3>
          {instructors.filter(i => !i.isPurchased).map(inst => (
            <TaroCompat.Div key={inst.id} className="bg-white rounded-xl p-4 shadow-sm mb-3">
              <TaroCompat.Div className="flex items-center gap-3">
                <TaroCompat.Img src={inst.avatar} alt={inst.name} className="w-14 h-14 rounded-full object-cover" />
                <TaroCompat.Div className="flex-1">
                  <TaroCompat.P className="text-base font-semibold text-gray-800">{inst.name}</TaroCompat.P>
                  <TaroCompat.P className="text-xs text-gray-500">{inst.title}</TaroCompat.P>
                  <TaroCompat.Div className="flex items-center gap-3 mt-1">
                    <TaroCompat.Span className="text-xs text-gray-400 flex items-center gap-0.5">
                      <BookOpen size={10} /> {inst.courses}门课
                    </TaroCompat.Span>
                    <TaroCompat.Span className="text-xs text-gray-400 flex items-center gap-0.5">
                      <Users size={10} /> {inst.students}学员
                    </TaroCompat.Span>
                  </TaroCompat.Div>
                </TaroCompat.Div>
              </TaroCompat.Div>
              <TaroCompat.P className="text-xs text-gray-600 mt-3 leading-relaxed">{inst.description}</TaroCompat.P>
              <TaroCompat.Div className="flex items-center justify-between mt-3">
                <TaroCompat.Span className="text-sm font-bold text-[#2D5AF5]">{inst.price > 0 ? `${inst.price}元/年` : '免费'}</TaroCompat.Span>
                <TaroCompat.ButtonCompat
                  onClick={() => handleAdd(inst)}
                  className="bg-[#2D5AF5] text-white text-xs px-4 py-2 rounded-full flex items-center gap-1"
                >
                  <Plus size={12} />
                  添加
                </TaroCompat.ButtonCompat>
              </TaroCompat.Div>
            </TaroCompat.Div>
          ))}
        </TaroCompat.Div>
      </TaroCompat.Div>
    </TaroCompat.Div>
  );
}
