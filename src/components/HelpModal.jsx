export default function HelpModal({ open, onClose }) {
  return (
    <>
      <div
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl transition-transform duration-300 ease-out max-h-[85vh] flex flex-col ${open ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="p-5 max-w-lg mx-auto w-full flex flex-col min-h-0 flex-1 overflow-y-auto">
          <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4 shrink-0" />

          <h2 className="text-lg font-bold text-gray-800 mb-2">인유스 기도함</h2>

          <blockquote className="border-l-3 border-amber-300 pl-3 mb-3 text-sm text-gray-500 italic">
            "두세 사람이 내 이름으로 모인 곳에 나도 그들 중에 있느니라" — 마태복음 18:20
          </blockquote>

          <p className="text-sm text-gray-700 leading-relaxed mb-4">
            이 사순절, 우리 함께 기도해요.<br />
            하나님께 함께 구하고, 서로의 기도제목을 품고 기도하는 시간이 되길 바랍니다.
          </p>

          <div className="space-y-4 text-sm text-gray-700">
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">✏️ 기도제목 올리기</h3>
              <p className="leading-relaxed">
                화면 하단 <span className="font-semibold">"기도제목 쓰기"</span> 버튼을 누르고, 나누고 싶은 기도제목을 적어주세요.
                이름을 비우면 익명으로 올라갑니다. 카드 색상도 골라보세요.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-1">🤲 함께 기도하기</h3>
              <ul className="list-disc list-inside space-y-1 leading-relaxed">
                <li><span className="font-semibold">기도 버튼</span>: 누군가의 기도제목을 위해 기도했다면 눌러주세요. 기도하고 있다는 마음이 전해집니다.</li>
                <li><span className="font-semibold">댓글</span>: 기도카드를 터치하면 댓글을 남길 수 있어요. 응원의 말, 함께 기도하겠다는 한마디를 전해주세요.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-1">📝 내 글 수정/삭제</h3>
              <p className="leading-relaxed">
                내가 올린 카드에만 수정/삭제 버튼이 보입니다.
                (기도제목을 올린 기기에서만 가능해요.)
              </p>
            </div>
          </div>

          <hr className="my-4 border-gray-100" />

          <p className="text-sm text-gray-500 leading-relaxed mb-2">
            부담 갖지 말고 편하게 기도제목을 나눠주세요.<br />
            작은 것도, 큰 것도 괜찮습니다. 우리가 함께 기도합니다.
          </p>
        </div>
      </div>
    </>
  )
}
