import { beforeEach,describe,expect,it,vi } from "vitest";
vi.mock("server-only",()=>({}));
const mocks=vi.hoisted(()=>({getUser:vi.fn(),maybeSingle:vi.fn()}));
vi.mock("@/lib/supabase/server",()=>({createSupabaseServerClient:async()=>({auth:{getUser:mocks.getUser}})}));
vi.mock("@/lib/supabase/admin",()=>({createSupabaseAdminClient:()=>({from:()=>({select:()=>({eq:()=>({maybeSingle:mocks.maybeSingle})})})})}));
import { adminAccess,sameOrigin } from "./access";
describe("admin access",()=>{
  beforeEach(()=>{vi.clearAllMocks();mocks.maybeSingle.mockResolvedValue({data:null,error:null});});
  it("denies anonymous and unconfirmed identities",async()=>{mocks.getUser.mockResolvedValue({data:{user:null},error:null});expect(await adminAccess()).toBeNull();mocks.getUser.mockResolvedValue({data:{user:{email:"meeyam0103@gmail.com"}},error:null});expect(await adminAccess()).toBeNull();});
  it("reserves management for the verified owner",async()=>{mocks.getUser.mockResolvedValue({data:{user:{id:"owner",email:"meeyam0103@gmail.com",email_confirmed_at:"now"}},error:null});expect((await adminAccess())?.owner).toBe(true);});
  it("does not trust editable metadata or grant other permissions implicitly",async()=>{mocks.getUser.mockResolvedValue({data:{user:{id:"other",email:"other@example.com",email_confirmed_at:"now",user_metadata:{role:"owner"}}},error:null});mocks.maybeSingle.mockResolvedValue({data:{respondents:false,results:true,answers:false},error:null});const access=await adminAccess();expect(access?.owner).toBe(false);expect(access?.permissions).toEqual({respondents:false,results:true,answers:false});});
  it("revocation takes effect on the next request",async()=>{mocks.getUser.mockResolvedValue({data:{user:{email:"other@example.com",email_confirmed_at:"now"}},error:null});expect((await adminAccess())?.permissions).toEqual({respondents:false,results:false,answers:false});});
  it("rejects cross-site writes",()=>{expect(sameOrigin(new Request("https://admin.example.com/api",{headers:{origin:"https://evil.example.com"}}))).toBe(false);expect(sameOrigin(new Request("https://admin.example.com/api",{headers:{origin:"https://admin.example.com"}}))).toBe(true);});
});
