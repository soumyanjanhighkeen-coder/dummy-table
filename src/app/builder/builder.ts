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

interface TemplateBlock {
  type: BlockType;
  props: Record<string, any>;
}

interface Template {
  name: string;
  icon: string;
  description: string;
  blocks: TemplateBlock[];
}

const TEMPLATES: Template[] = [
  {
    name: 'SaaS Landing',
    icon: '🚀',
    description: 'Hero, features, social proof, pricing',
    blocks: [
      { type: 'hero', props: { heading: 'The fastest way to build', subheading: 'Ship stunning landing pages in minutes, not days.', ctaText: 'Start for Free', ctaUrl: '#', bgColor: '#0f172a', headingColor: '#ffffff', subheadingColor: '#94a3b8', ctaBgColor: '#6366f1', ctaTextColor: '#ffffff' } },
      { type: 'features', props: { heading: 'Everything you need to succeed', bgColor: '#f8fafc', headingColor: '#1e293b' } },
      { type: 'testimonial', props: { quote: "This product has completely transformed how our team works. We've seen 3x productivity gains.", author: 'Sarah Johnson', role: 'CEO at TechCorp', bgColor: '#ffffff', quoteColor: '#1e293b', authorColor: '#1e293b', roleColor: '#64748b' } },
      { type: 'pricing', props: { heading: 'Simple, transparent pricing', bgColor: '#fff', headingColor: '#1e293b', plan1: 'Free', price1: '$0', plan2: 'Pro', price2: '$12', plan3: 'Agency', price3: '$49', ctaUrl: '#', ctaBgColor: '#6366f1' } },
      { type: 'cta-banner', props: { heading: 'Ready to get started?', subheading: 'Join thousands of teams already using our platform.', ctaText: 'Start for Free', ctaUrl: '#', bgColor: '#6366f1' } },
    ],
  },
  {
    name: 'Personal Portfolio',
    icon: '✨',
    description: 'Hero, about, work samples, contact',
    blocks: [
      { type: 'hero', props: { heading: 'Hi, I\'m Alex — Product Designer', subheading: 'I craft beautiful digital experiences that users love.', ctaText: 'View my work', ctaUrl: '#', bgColor: '#1e293b', headingColor: '#ffffff', subheadingColor: '#94a3b8', ctaBgColor: '#8b5cf6', ctaTextColor: '#ffffff' } },
      { type: 'heading', props: { text: 'About Me', level: 'h2', color: '#1e293b', align: 'center', size: '2.5rem' } },
      { type: 'paragraph', props: { text: 'I\'m a product designer with 8 years of experience building user-centered digital products. I love crafting interfaces that are both beautiful and intuitive.', color: '#475569', align: 'center', size: '1.125rem' } },
      { type: 'gallery', props: { img1: '', img2: '', img3: '', img4: '', img5: '', img6: '', borderRadius: '12px' } },
      { type: 'form', props: { heading: 'Let\'s work together', subheading: 'Have a project in mind? I\'d love to hear about it.', bgColor: '#f8fafc', headingColor: '#1e293b', ctaBgColor: '#8b5cf6', buttonText: 'Send message' } },
    ],
  },
  {
    name: 'Newsletter Page',
    icon: '📬',
    description: 'Minimal signup page with social proof',
    blocks: [
      { type: 'hero', props: { heading: 'The weekly dose of startup wisdom', subheading: 'Actionable insights for founders, builders, and makers. Every Tuesday.', ctaText: 'Read latest issue', ctaUrl: '#', bgColor: '#0f172a', headingColor: '#ffffff', subheadingColor: '#94a3b8', ctaBgColor: '#10b981', ctaTextColor: '#ffffff' } },
      { type: 'paragraph', props: { text: 'Join 12,000+ readers who get our newsletter every week. No spam. Unsubscribe anytime.', color: '#475569', align: 'center', size: '1.125rem' } },
      { type: 'newsletter', props: { heading: 'Stay in the loop', subheading: 'Get the latest updates delivered to your inbox every Tuesday.', bgColor: '#0f172a', headingColor: '#ffffff', subheadingColor: '#94a3b8', ctaBgColor: '#10b981', buttonText: 'Subscribe for free' } },
      { type: 'divider', props: { color: '#e2e8f0', thickness: '1px' } },
      { type: 'cta-banner', props: { heading: 'Start reading today', subheading: 'Over 12,000 founders and makers already subscribed.', ctaText: 'Get early access', ctaUrl: '#', bgColor: '#10b981' } },
    ],
  },
  {
    name: 'Product Launch',
    icon: '🎯',
    description: 'Launch page with video and testimonials',
    blocks: [
      { type: 'hero', props: { heading: 'Introducing the future of work', subheading: 'The all-in-one platform that replaces your stack. Now in public beta.', ctaText: 'Join the waitlist', ctaUrl: '#', bgColor: '#020617', headingColor: '#ffffff', subheadingColor: '#94a3b8', ctaBgColor: '#f59e0b', ctaTextColor: '#0f172a' } },
      { type: 'features', props: { heading: 'Built for modern teams', bgColor: '#f8fafc', headingColor: '#1e293b' } },
      { type: 'video', props: { url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', caption: 'Watch a 2-minute product demo' } },
      { type: 'testimonial', props: { quote: 'We replaced 5 different tools with this one platform. Our team is more productive than ever.', author: 'Mark Chen', role: 'CTO at Horizon Inc.', bgColor: '#ffffff', quoteColor: '#1e293b', authorColor: '#1e293b', roleColor: '#64748b' } },
      { type: 'cta-banner', props: { heading: 'Be the first to know when we launch', subheading: 'Join 3,000+ teams on the waitlist.', ctaText: 'Join the waitlist', ctaUrl: '#', bgColor: '#f59e0b' } },
    ],
  },
];

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
  readonly templates = TEMPLATES;

  blocks = signal<Block[]>([]);
  selectedBlockId = signal<string | null>(null);
  device = signal<DeviceWidth>('desktop');
  exportCode = signal<string>('');
  showExport = signal(false);
  showPublish = signal(false);
  showTemplates = signal(false);
  showUpgrade = signal(false);
  brandColor = signal('#6366f1');

  // ── History (undo/redo) ──────────────────────────────
  private history: Block[][] = [[]];
  private historyIndex = 0;
  private propChangeTimer: ReturnType<typeof setTimeout> | null = null;

  canUndo = computed(() => this.historyIndex > 0);
  canRedo = computed(() => this.historyIndex < this.history.length - 1);

  private pushHistory() {
    this.history = this.history.slice(0, this.historyIndex + 1);
    this.history.push(this.blocks().map(b => ({ ...b, props: { ...b.props } })));
    this.historyIndex = this.history.length - 1;
  }

  undo() {
    if (this.historyIndex <= 0) return;
    this.historyIndex--;
    this.blocks.set(this.history[this.historyIndex].map(b => ({ ...b, props: { ...b.props } })));
    this.rebuildCanvas();
  }

  redo() {
    if (this.historyIndex >= this.history.length - 1) return;
    this.historyIndex++;
    this.blocks.set(this.history[this.historyIndex].map(b => ({ ...b, props: { ...b.props } })));
    this.rebuildCanvas();
  }

  private rebuildCanvas() {
    this.selectedBlockId.set(null);
    const htmlBlocks = this.blocks().map(b => generateBlockHtml(b));
    this.sendToCanvas({ type: 'REBUILD_CANVAS', payload: { blocks: htmlBlocks } });
  }

  // ── Computed ─────────────────────────────────────────
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
        isUrl: key.toLowerCase().includes('url') || key.toLowerCase().includes('src') || key.startsWith('img'),
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
    if (this.propChangeTimer) clearTimeout(this.propChangeTimer);
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
      this.pushHistory();
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

    if (type === 'BLOCK_REORDERED') {
      const order: string[] = payload.order;
      this.blocks.update(bs => order.map(id => bs.find(b => b.id === id)!).filter(Boolean));
      this.pushHistory();
    }

    if (type === 'EXPORT_RESULT') {
      this.exportCode.set(payload.html);
      if (this.showPublish()) {
        // already showing publish modal — just update the code
      } else {
        this.showExport.set(true);
      }
    }

    if (type === 'SHOW_UPGRADE') {
      this.showUpgrade.set(true);
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
    this.pushHistory();
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

    // Debounce history push on prop changes
    if (this.propChangeTimer) clearTimeout(this.propChangeTimer);
    this.propChangeTimer = setTimeout(() => this.pushHistory(), 800);
  }

  onImageUpload(key: string, event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      this.onPropChange(key, reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  onBrandColor(color: string) {
    this.brandColor.set(color);
    this.sendToCanvas({ type: 'UPDATE_BRAND_COLOR', payload: { color } });
  }

  // ── Templates ────────────────────────────────────────
  applyTemplate(template: Template) {
    const blocks: Block[] = template.blocks.map(b => ({
      id: crypto.randomUUID(),
      type: b.type,
      props: { ...b.props },
    }));
    this.blocks.set(blocks);
    this.selectedBlockId.set(null);
    this.history = [[]];
    this.historyIndex = 0;
    this.pushHistory();
    this.rebuildCanvas();
    this.showTemplates.set(false);
  }

  private syncPropToCanvas(blockId: string, blockType: BlockType, key: string, value: string) {
    // Gallery images — use UPDATE_GALLERY
    if (blockType === 'gallery') {
      const block = this.selectedBlock();
      if (!block) return;
      this.sendToCanvas({
        type: 'UPDATE_GALLERY',
        payload: { id: blockId, ...block.props, [key]: value },
      });
      return;
    }

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

    if (blockType === 'video' && key === 'url') {
      this.sendToCanvas({
        type: 'UPDATE_VIDEO_URL',
        payload: { id: blockId, url: value },
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

  openPublish() {
    // Trigger export first to get latest HTML
    this.sendToCanvas({ type: 'EXPORT_HTML' });
    this.showPublish.set(true);
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

  @HostListener('document:keydown', ['$event'])
  onKeydown(e: KeyboardEvent) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      this.undo();
    }
    if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
      e.preventDefault();
      this.redo();
    }
    if (e.key === 'Escape') {
      this.showExport.set(false);
      this.showPublish.set(false);
      this.showTemplates.set(false);
      this.showUpgrade.set(false);
    }
  }
}
