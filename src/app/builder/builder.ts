import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  ViewChild,
  computed,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Block, BlockType, INLINE_PROPS, PALETTE, generateBlockHtml } from './blocks';
import { generateCanvasDocument } from './canvas-doc';

type DeviceWidth = 'desktop' | 'tablet' | 'mobile';

const DEVICE_WIDTHS: Record<DeviceWidth, string> = {
  desktop: '100%',
  tablet: '768px',
  mobile: '390px',
};

@Component({
  selector: 'app-builder',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './builder.html',
  styleUrl: './builder.css',
})
export class BuilderComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvasFrame') canvasRef!: ElementRef<HTMLIFrameElement>;

  readonly palette = PALETTE;
  readonly deviceWidths = DEVICE_WIDTHS;
  readonly deviceOptions: DeviceWidth[] = ['desktop', 'tablet', 'mobile'];

  blocks = signal<Block[]>([]);
  selectedBlockId = signal<string | null>(null);
  device = signal<DeviceWidth>('desktop');
  exportCode = signal<string>('');
  showExport = signal(false);

  selectedBlock = computed(() =>
    this.blocks().find((b) => b.id === this.selectedBlockId()) ?? null,
  );

  propEntries = computed(() => {
    const block = this.selectedBlock();
    if (!block) return [];
    return Object.entries(block.props)
      .filter(([key]) => !INLINE_PROPS.has(key) && key !== 'features')
      .map(([key, value]) => ({
        key,
        label: this.camelToLabel(key),
        isColor: key.toLowerCase().includes('color'),
        isUrl: key.toLowerCase().includes('url') || key.toLowerCase().includes('src'),
        isSelect: key === 'align' || key === 'level' || key === 'size',
        selectOptions: this.getSelectOptions(key),
        value: value as string,
      }));
  });

  private messageHandler = this.onMessage.bind(this);

  ngAfterViewInit() {
    const iframe = this.canvasRef.nativeElement;
    iframe.srcdoc = generateCanvasDocument();
    window.addEventListener('message', this.messageHandler);
  }

  ngOnDestroy() {
    window.removeEventListener('message', this.messageHandler);
  }

  private onMessage(e: MessageEvent) {
    const iframe = this.canvasRef?.nativeElement;
    if (!iframe || e.source !== iframe.contentWindow) return;
    const { type, payload } = e.data as { type: string; payload: any };

    if (type === 'BLOCK_SELECTED') {
      this.selectedBlockId.set(payload.id);
    }

    if (type === 'BLOCK_DESELECTED') {
      this.selectedBlockId.set(null);
    }

    if (type === 'BLOCK_DELETED') {
      this.blocks.update((bs) => bs.filter((b) => b.id !== payload.id));
      if (this.selectedBlockId() === payload.id) this.selectedBlockId.set(null);
    }

    if (type === 'CONTENT_CHANGED') {
      this.blocks.update((bs) =>
        bs.map((b) =>
          b.id === payload.blockId
            ? { ...b, props: { ...b.props, [payload.field]: payload.value } }
            : b,
        ),
      );
    }

    if (type === 'ADD_BLOCK_TYPE') {
      this.addBlock(payload.blockType as BlockType);
    }

    if (type === 'EXPORT_RESULT') {
      this.exportCode.set(payload.html);
      this.showExport.set(true);
    }
  }

  addBlock(type: BlockType) {
    const item = PALETTE.find((p) => p.type === type);
    if (!item) return;
    const block: Block = {
      id: crypto.randomUUID(),
      type,
      props: { ...item.defaultProps },
    };
    this.blocks.update((bs) => [...bs, block]);
    this.sendToCanvas({ type: 'ADD_BLOCK', payload: { html: generateBlockHtml(block) } });
  }

  onPropChange(key: string, value: string) {
    const block = this.selectedBlock();
    if (!block) return;

    // Update local state
    this.blocks.update((bs) =>
      bs.map((b) =>
        b.id === block.id ? { ...b, props: { ...b.props, [key]: value } } : b,
      ),
    );

    // Determine what to send to the canvas
    this.syncPropToCanvas(block.id, block.type, key, value);
  }

  private syncPropToCanvas(blockId: string, blockType: BlockType, key: string, value: string) {
    // Map prop key → CSS targets in the iframe
    const colorFieldMap: Record<string, { field: string; css: string } | null> = {
      bgColor: null, // handled as block-level style
      headingColor: { field: 'heading', css: 'color' },
      subheadingColor: { field: 'subheading', css: 'color' },
      ctaBgColor: { field: 'ctaText', css: 'background' },
      ctaTextColor: { field: 'ctaText', css: 'color' },
      color: { field: 'text', css: 'color' },
      quoteColor: { field: 'quote', css: 'color' },
      authorColor: { field: 'author', css: 'color' },
      roleColor: { field: 'role', css: 'color' },
      headingColor2: { field: 'heading', css: 'color' },
      textColor: { field: 'text', css: 'color' },
    };

    if (key === 'bgColor') {
      this.sendToCanvas({
        type: 'UPDATE_BLOCK_STYLE',
        payload: { id: blockId, styles: { background: value } },
      });
      return;
    }

    if (key in colorFieldMap) {
      const target = colorFieldMap[key];
      if (target) {
        this.sendToCanvas({
          type: 'UPDATE_FIELD_STYLE',
          payload: { blockId, field: target.field, styles: { [target.css]: value } },
        });
      }
      return;
    }

    if (key === 'align') {
      this.sendToCanvas({
        type: 'UPDATE_FIELD_STYLE',
        payload: { blockId, field: 'text', styles: { textAlign: value } },
      });
      this.sendToCanvas({
        type: 'UPDATE_BLOCK_STYLE',
        payload: { id: blockId, styles: { textAlign: value } },
      });
      return;
    }

    if (key === 'size') {
      this.sendToCanvas({
        type: 'UPDATE_FIELD_STYLE',
        payload: { blockId, field: 'text', styles: { fontSize: value } },
      });
      return;
    }

    if (key === 'src' || key === 'alt' || key === 'borderRadius') {
      const block = this.selectedBlock();
      if (!block) return;
      this.sendToCanvas({
        type: 'UPDATE_IMAGE_SRC',
        payload: { id: blockId, src: block.props['src'], alt: block.props['alt'], borderRadius: block.props['borderRadius'] },
      });
      return;
    }

    // For button colors
    if (key === 'textColor') {
      this.sendToCanvas({
        type: 'UPDATE_FIELD_STYLE',
        payload: { blockId, field: 'text', styles: { color: value } },
      });
    }
  }

  exportHtml() {
    this.sendToCanvas({ type: 'EXPORT_HTML' });
  }

  downloadHtml() {
    const html = this.exportCode();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'page.html';
    a.click();
    URL.revokeObjectURL(url);
  }

  copyHtml() {
    navigator.clipboard.writeText(this.exportCode());
  }

  setDevice(d: DeviceWidth) {
    this.device.set(d);
  }

  get paletteCategories() {
    const cats: Record<string, typeof PALETTE> = {};
    for (const item of PALETTE) {
      (cats[item.category] ??= []).push(item);
    }
    return Object.entries(cats);
  }

  private sendToCanvas(msg: unknown) {
    this.canvasRef?.nativeElement.contentWindow?.postMessage(msg, '*');
  }

  private camelToLabel(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (c) => c.toUpperCase())
      .trim();
  }

  private getSelectOptions(key: string): string[] {
    if (key === 'align') return ['left', 'center', 'right'];
    if (key === 'level') return ['h1', 'h2', 'h3', 'h4'];
    if (key === 'size') return ['0.875rem', '1rem', '1.125rem', '1.25rem', '1.5rem', '2rem', '2.5rem', '3rem'];
    return [];
  }

  @HostListener('keydown.escape')
  onEsc() {
    this.showExport.set(false);
  }
}
