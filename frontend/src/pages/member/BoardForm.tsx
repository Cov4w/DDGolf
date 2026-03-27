import { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { boardsService } from '../../services/boards';

export default function BoardForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    is_public: false,
  });
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useQuery({
    queryKey: ['post', id],
    queryFn: () => boardsService.getPost(Number(id)),
    enabled: isEdit,
    // @ts-expect-error onSuccess is deprecated but still works
    onSuccess: (data: { title: string; content: string; is_public: boolean }) => {
      setFormData({
        title: data.title,
        content: data.content,
        is_public: data.is_public,
      });
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: FormData) => boardsService.createPost(data),
    onSuccess: () => navigate('/boards'),
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<{ title: string; content: string; is_public: boolean }>) =>
      boardsService.updatePost(Number(id), data),
    onSuccess: () => navigate(`/boards/${id}`),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEdit) {
      updateMutation.mutate(formData);
    } else {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('content', formData.content);
      data.append('is_public', String(formData.is_public));
      images.forEach((img) => data.append('images', img));
      createMutation.mutate(data);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages((prev) => [...prev, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrls((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {isEdit ? '게시글 수정' : '게시글 작성'}
      </h1>

      <form onSubmit={handleSubmit} className="card space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            제목
          </label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="input"
            required
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            내용
          </label>
          <textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="input"
            rows={10}
            required
          />
        </div>

        {!isEdit && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이미지
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              multiple
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="btn btn-secondary"
            >
              이미지 추가
            </button>

            {previewUrls.length > 0 && (
              <div className="mt-4 grid grid-cols-4 gap-4">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt=""
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex items-center">
          <input
            type="checkbox"
            id="is_public"
            checked={formData.is_public}
            onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
            className="mr-2"
          />
          <label htmlFor="is_public" className="text-sm text-gray-700">
            비회원에게도 공개
          </label>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn btn-secondary"
          >
            취소
          </button>
          <button type="submit" className="btn btn-primary">
            {isEdit ? '수정' : '작성'}
          </button>
        </div>
      </form>
    </div>
  );
}
