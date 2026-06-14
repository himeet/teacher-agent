import { useState } from 'react';
import { Plus, BookOpen, Users, Star, Upload } from 'lucide-react';
import { courses, instructors } from '@/data/mockData';
import * as TaroCompat from '@/components/TaroCompat';

export default function AdminCourses() {
  const [tab, setTab] = useState<'enterprise' | 'purchased'>('enterprise');
  const [showUpload, setShowUpload] = useState(false);

  return (
    <TaroCompat.Div className="p-6 space-y-4">
      <TaroCompat.Div className="flex items-center justify-between">
        <TaroCompat.H1 className="text-xl font-bold text-gray-800">课程库</TaroCompat.H1>
        <TaroCompat.Div className="flex items-center gap-2">
          <TaroCompat.ButtonCompat
            onClick={() => setShowUpload(!showUpload)}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
          >
            <Upload size={14} />
            上传资料
          </TaroCompat.ButtonCompat>
          <TaroCompat.ButtonCompat className="flex items-center gap-1.5 px-3 py-2 bg-[#2D5AF5] text-white rounded-lg text-sm hover:bg-[#2548C8]">
            <Plus size={14} />
            新建课程
          </TaroCompat.ButtonCompat>
        </TaroCompat.Div>
      </TaroCompat.Div>

      {showUpload && (
        <TaroCompat.Div className="bg-white rounded-xl p-5 border border-gray-100 border-dashed-2">
          <TaroCompat.Div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
            <Upload size={32} className="text-gray-300 mx-auto mb-3" />
            <TaroCompat.P className="text-sm text-gray-600 mb-1">拖拽文件到此处，或点击上传</TaroCompat.P>
            <TaroCompat.P className="text-xs text-gray-400">支持 PPT、PDF、Word、视频</TaroCompat.P>
            <TaroCompat.ButtonCompat className="mt-3 px-4 py-2 bg-gray-100 text-gray-600 text-sm rounded-lg hover:bg-gray-200">
              选择文件
            </TaroCompat.ButtonCompat>
          </TaroCompat.Div>
        </TaroCompat.Div>
      )}

      <TaroCompat.Div className="flex gap-0 bg-white rounded-xl p-1 border border-gray-100 w-fit">
        {[
          { key: 'enterprise' as const, label: '企业私有课程' },
          { key: 'purchased' as const, label: '采购课程' },
        ].map(t => (
          <TaroCompat.ButtonCompat
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm transition-all ${
              tab === t.key ? 'bg-[#2D5AF5] text-white' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {t.label}
          </TaroCompat.ButtonCompat>
        ))}
      </TaroCompat.Div>

      <TaroCompat.Div className="grid grid-cols-2 gap-4">
        {courses.map(course => (
          <TaroCompat.Div key={course.id} className="bg-white rounded-xl p-4 border border-gray-100 flex gap-4">
            <TaroCompat.Img src={course.cover} alt={course.title} className="w-24 h-16 rounded-lg object-cover shrink-0" />
            <TaroCompat.Div className="flex-1 min-w-0">
              <TaroCompat.Div className="flex items-center gap-2">
                <TaroCompat.H3 className="text-sm font-semibold text-gray-800 truncate">{course.title}</TaroCompat.H3>
                {course.type === 'enterprise' && (
                  <TaroCompat.Span className="shrink-0 text-[10px] bg-[#E8EFFD] text-[#2D5AF5] px-1.5 py-0.5 rounded">企业</TaroCompat.Span>
                )}
              </TaroCompat.Div>
              <TaroCompat.P className="text-xs text-gray-500 mt-0.5">{course.instructorName} · {course.totalLessons}节课</TaroCompat.P>
              <TaroCompat.Div className="flex items-center gap-3 mt-2">
                <TaroCompat.Span className="text-xs text-gray-400 flex items-center gap-0.5">
                  <BookOpen size={10} /> {course.completedLessons}/{course.totalLessons}
                </TaroCompat.Span>
                <TaroCompat.Span className="text-xs text-gray-400 flex items-center gap-0.5">
                  <Users size={10} /> 24人学习中
                </TaroCompat.Span>
                <TaroCompat.Span className="text-xs text-gray-400 flex items-center gap-0.5">
                  <Star size={10} className="text-amber-400" /> 4.8
                </TaroCompat.Span>
              </TaroCompat.Div>
            </TaroCompat.Div>
          </TaroCompat.Div>
        ))}
      </TaroCompat.Div>

      {tab === 'purchased' && (
        <TaroCompat.Div className="grid grid-cols-2 gap-4">
          {instructors.filter(i => !i.isEnterprise).map(inst => (
            <TaroCompat.Div key={inst.id} className="bg-white rounded-xl p-4 border border-gray-100 flex gap-4">
              <TaroCompat.Img src={inst.avatar} alt={inst.name} className="w-16 h-16 rounded-lg object-cover shrink-0" />
              <TaroCompat.Div className="flex-1 min-w-0">
                <TaroCompat.H3 className="text-sm font-semibold text-gray-800">{inst.name}</TaroCompat.H3>
                <TaroCompat.P className="text-xs text-gray-500">{inst.title}</TaroCompat.P>
                <TaroCompat.P className="text-xs text-gray-400 mt-1">{inst.courses}门课程 · {inst.students}学员</TaroCompat.P>
                <TaroCompat.Div className="flex items-center justify-between mt-2">
                  <TaroCompat.Span className="text-xs text-gray-400">{inst.specialty}</TaroCompat.Span>
                  <TaroCompat.ButtonCompat className="text-xs bg-[#2D5AF5] text-white px-3 py-1 rounded-full">
                    {inst.isPurchased ? '已采购' : '选购'}
                  </TaroCompat.ButtonCompat>
                </TaroCompat.Div>
              </TaroCompat.Div>
            </TaroCompat.Div>
          ))}
        </TaroCompat.Div>
      )}
    </TaroCompat.Div>
  );
}
