import api from '@/shared/api/api';

export type GalleryImageDto = {
  imageID: number;
  barberShopID: number;
  filePath: string;
  sortOrder: number;
};

export class AdminGalleryApi {
  static async list(): Promise<GalleryImageDto[]> {
    const res = await api.get('/gallery-images');
    return res.data;
  }

  static async upload(files: File[]): Promise<GalleryImageDto[]> {
    const form = new FormData();
    for (const f of files) form.append('images', f);

    const res = await api.post('/gallery-images', form);
    return res.data;
  }

  static async setSortOrder(id: number, sortOrder: number): Promise<GalleryImageDto> {
    const res = await api.put(`/gallery-images/${id}`, { sortOrder });
    return res.data;
  }

  static async remove(id: number): Promise<void> {
    await api.delete(`/gallery-images/${id}`);
  }
}
