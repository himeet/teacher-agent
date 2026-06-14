import { useState, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { quickQuestions } from '@/data/mockData';
import * as TaroCompat from '@/components/TaroCompat';
import MarkdownContent from '@/components/MarkdownContent';
import MiniIcon from '@/components/MiniIcon';
import { miniSafeHeaderStyle } from '@/lib/platform';

export default function ChatPage() {
  const { chatMessages, isAiTyping, sendChatMessage } = useApp();
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const latestMessage = chatMessages[chatMessages.length - 1];
  const streamingMessageId = isAiTyping && latestMessage?.role === 'ai' ? latestMessage.id : null;
  const latestMessageContent = latestMessage?.content ?? '';
  const autoScrollTop = 1_000_000 + chatMessages.length * 1000 + latestMessageContent.length + (isAiTyping ? 500 : 0);
  const scrollAnchorId = `chat-bottom-${chatMessages.length}-${latestMessageContent.length}-${isAiTyping ? 1 : 0}`;

  const handleSend = () => {
    if (!input.trim() || isAiTyping) return;
    sendChatMessage(input.trim());
    setInput('');
  };

  const handleQuickQuestion = (q: string) => {
    if (isAiTyping) return;
    sendChatMessage(q);
  };

  return (
    <TaroCompat.Div className="h-full flex flex-col bg-[#F4F6F8]">
      {/* Header */}
      <TaroCompat.Div
        className="shrink-0 bg-white px-4 pb-3 flex items-center gap-3 border-b border-gray-100"
        style={miniSafeHeaderStyle(10)}
      >
        <TaroCompat.Div className="relative">
          <TaroCompat.Img src="/images/instructor_shen.jpg" alt="沈羽婷" className="w-9 h-9 rounded-full object-cover" />
          <TaroCompat.Span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white" />
        </TaroCompat.Div>
        <TaroCompat.Div className="flex-1">
          <TaroCompat.P className="text-sm font-semibold text-gray-800">沈羽婷的AI分身</TaroCompat.P>
          <TaroCompat.P className="text-[10px] text-gray-500">基于《成交策略》课程训练</TaroCompat.P>
        </TaroCompat.Div>
        <TaroCompat.Div className="text-xs text-gray-400 flex items-center gap-1">
          <MiniIcon name="clock" size={12} />
          <TaroCompat.Span>历史</TaroCompat.Span>
        </TaroCompat.Div>
      </TaroCompat.Div>

      {/* Messages Area */}
      <TaroCompat.ScrollContainer
        className="flex-1 min-h-0 px-4 py-4 space-y-4"
        scrollTop={autoScrollTop}
        scrollIntoView={scrollAnchorId}
        enableFlex
        scrollAnchoring
      >
        {chatMessages.map(msg => (
          <TaroCompat.Div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'ai' && (
              <TaroCompat.Img src="/images/instructor_shen.jpg" alt="AI" className="w-7 h-7 rounded-full object-cover self-start mr-2 shrink-0" />
            )}
            <TaroCompat.Div className={`max-w-[80%] ${msg.role === 'user' ? 'order-first' : ''}`}>
              <TaroCompat.Div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-[#2D5AF5] text-white rounded-br-md whitespace-pre-wrap'
                  : 'bg-white text-gray-800 rounded-bl-md shadow-sm'
              }`}>
                {msg.role === 'ai' ? (
                  <MarkdownContent
                    content={msg.content}
                    trailing={msg.id === streamingMessageId ? (
                      <TaroCompat.Span className="inline-block w-1.5 h-4 bg-[#2D5AF5] ml-0.5 animate-pulse align-middle" />
                    ) : null}
                  />
                ) : (
                  <>
                    {msg.content}
                    {msg.id === streamingMessageId && (
                      <TaroCompat.Span className="inline-block w-1.5 h-4 bg-[#2D5AF5] ml-0.5 animate-pulse align-middle" />
                    )}
                  </>
                )}
              </TaroCompat.Div>
              {msg.role === 'ai' && msg.metadata?.source && msg.id !== streamingMessageId && msg.content.trim() && (
                <TaroCompat.Div className="flex items-center gap-1 mt-1.5 ml-1">
                  <MiniIcon name="book" size={11} className="text-[#2D5AF5]" />
                  <TaroCompat.Span className="text-[10px] text-[#2D5AF5]">{msg.metadata.source}</TaroCompat.Span>
                </TaroCompat.Div>
              )}
              <TaroCompat.P className="text-[10px] text-gray-400 mt-1 px-1">
                {msg.timestamp.split(' ')[1]}
              </TaroCompat.P>
            </TaroCompat.Div>
          </TaroCompat.Div>
        ))}

        {isAiTyping && !streamingMessageId && (
          <TaroCompat.Div className="flex justify-start">
            <TaroCompat.Img src="/images/instructor_shen.jpg" alt="AI" className="w-7 h-7 rounded-full object-cover self-start mr-2" />
            <TaroCompat.Div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
              <TaroCompat.Div className="flex items-center gap-1.5">
                <MiniIcon name="sparkles" size={14} className="text-[#2D5AF5] animate-spin" />
                <TaroCompat.Span className="text-xs text-gray-500">思考中...</TaroCompat.Span>
              </TaroCompat.Div>
            </TaroCompat.Div>
          </TaroCompat.Div>
        )}
        <TaroCompat.Div id={scrollAnchorId} className="h-px" />
      </TaroCompat.ScrollContainer>

      {/* Composer */}
      <TaroCompat.Div className="shrink-0 bg-white border-t border-gray-100">
        {!isAiTyping && (
          <TaroCompat.Div className="chat-quick-questions scrollbar-hide">
            {quickQuestions.map(q => (
              <TaroCompat.ButtonCompat
                key={q}
                onClick={() => handleQuickQuestion(q)}
                className="chat-quick-question-chip"
              >
                <TaroCompat.Span className="chat-quick-question-text">{q}</TaroCompat.Span>
              </TaroCompat.ButtonCompat>
            ))}
          </TaroCompat.Div>
        )}

        {/* Input Area */}
        <TaroCompat.Div className="px-4 pt-2 pb-3 flex items-center gap-2">
          <TaroCompat.CompatInput
            ref={inputRef}
            value={input}
            onChange={(e: any) => setInput(e.target.value)}
            onKeyDown={(e: any) => e.key === 'Enter' && handleSend()}
            placeholder="输入问题，向AI讲师请教..."
            className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2D5AF5]/30 transition-all"
          />
          <TaroCompat.ButtonCompat
            onClick={handleSend}
            disabled={!input.trim() || isAiTyping}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              input.trim() && !isAiTyping
                ? 'bg-[#2D5AF5] text-white hover:bg-[#2548C8]'
                : 'bg-gray-200 text-gray-400'
            }`}
          >
            <MiniIcon name="send" size={16} />
          </TaroCompat.ButtonCompat>
        </TaroCompat.Div>
      </TaroCompat.Div>
    </TaroCompat.Div>
  );
}
