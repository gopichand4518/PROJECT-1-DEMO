import { useState, type ChangeEvent } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { supabase } from "../supabase-client"
import { useAuth } from "../context/AuthContext";
import { fetchCommunities, type Community } from "./CommunityList";

interface PostInput {
    title : string;
    content: string;
    avatar_url : string | null;
    community_id ?: number | null;
}

const createPost = async (post: PostInput, imageFile : File) => {
    
    const filePath = `${post.title}-${Date.now()}-${imageFile.name}`
    
    const {error: uploadError} = await supabase.storage.from("post-images").upload(filePath,imageFile)
    if(uploadError) throw Error(uploadError.message);
    
    const {data : publicURLData} = supabase.storage.from("post-images").getPublicUrl(filePath)

    const {data,error} = await supabase.from("posts").insert({...post,  image_url:publicURLData.publicUrl});



    if(error) throw Error(error.message);

        return data;

};
const CreatePost = () => {
    const [title,setTitle] = useState<string>("")
    const [content,setContent] = useState<string>("")
    const [communityId,setCommunityId] = useState<number | null>(null)
    const [selectedFile,setSelectdFile] = useState<File | null>(null)
    const {user} = useAuth()

      const {data : communities} = useQuery<Community[] , Error>({
        queryKey : ["communities"],
        queryFn : fetchCommunities,
        })

    const { mutate , isPending, isError } = useMutation({mutationFn: (data : {post : PostInput ,imageFile : File}) => {
        return createPost(data.post , data.imageFile);
    }});

    const handleSubmit = (event: React.FormEvent) =>{
        event.preventDefault();
        if(!selectedFile) return; 
        mutate({ post : {
            title,
            content,
            avatar_url: user?.user_metadata.avatar_url || null,
            community_id : communityId,
        },
         imageFile : selectedFile || null})
    }

    const handleCommunityChange = (e: ChangeEvent<HTMLSelectElement>) =>{
       const value  = e.target.value;
       setCommunityId(value ? Number(value) : null)

    }
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) =>{
        if(e.target.files && e.target.files[0]){
            setSelectdFile(e.target.files[0])
        }
    }


  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
        {" "}
        <div>
            {" "}
            <label htmlFor="" className="block mb-2 font-medium">Title</label>
            <input type="text" 
                    id="title" 
                    required  
                    className="w-full border border-white/10 bg-transparent p-2 rounded"
                    onChange={(event) => setTitle(event.target.value)}/>
        </div>
        <div>
            {" "}
            <label htmlFor="" className="block mb-2 font-medium">Content</label>
            <textarea id="content"
                     required 
                     rows={5}
                     className="w-full border border-white/10 bg-transparent p-2 rounded"
                    onChange={(event) => setContent(event.target.value)}
                     />
        </div>
<div className="flex flex-row items-center gap-4 mb-4">
  <label htmlFor="community" className="font-medium text-white text-sm whitespace-nowrap">
    Select Community
  </label>
  
  <select 
    id="community"
    onChange={handleCommunityChange}
    className="w-56 border border-white/10 bg-[#1A1A2E] text-white p-2 rounded outline-none cursor-pointer"
  >
    <option value="" className="bg-[#1A1A2E] text-gray-400">-- Choose a Community --</option>
    {communities?.map((community, key) => (
      <option key={key} value={community.id} className="bg-[#1A1A2E] text-white">
        {community.name}
      </option>
    ))}
  </select>
</div>
        
        <div>
            {" "}
            <label  htmlFor ="image" className="block mb-2 font-medium">
                Upload Image
            </label>
            <input id="image"
                    type="file"
                    accept="image/*"
                     required 
                     className="w-full text-gray-200"
                    onChange={handleFileChange}
                     />
        </div>

        <button 
        type="submit" 
        className="bg-purple-500 text-white px-4 py-2 rounded cursor-pointer" >
           {isPending?"Creating..." :" Create Post"}
            </button>

        {isError && <p className = "text-red-500">Error creating post</p>}
    </form>
  )
}

export default CreatePost