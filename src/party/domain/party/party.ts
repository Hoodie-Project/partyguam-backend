export class Party {
  constructor(
    public id: number,
    public partyTypeId: number,
    public title: string,
    public content: string,
    public image: string,
  ) {}

  getId(): Readonly<number> {
    return this.id;
  }

  updateFields(
    partyTypeId: number | undefined,
    title: string | undefined,
    content: string | undefined,
    image: string | undefined,
  ): void {
    if (partyTypeId !== undefined) {
      this.partyTypeId = partyTypeId;
    }
    if (title !== undefined) {
      this.title = title;
    }
    if (content !== undefined) {
      this.content = content;
    }
    if (image !== undefined) {
      this.image = image;
    }
  }

  updateImage(image: string | undefined): void {
    if (image !== undefined) {
      this.image = image;
    }
  }
}
