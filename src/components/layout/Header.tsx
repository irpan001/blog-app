'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/authContext';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as AlertDialog from '@radix-ui/react-alert-dialog';

const Header = () => {
  const { isLogin } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [userName, setUserName] = useState('');
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const name = localStorage.getItem('userName');
    if (name) setUserName(name);
  }, []);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/?query=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    router.push('/login');
  };

  return (
    <div className='flex justify-between items-center py-5 sm:py-6 px-4 sm:px-30 bg-white border border-[#D5D7DA]'>
      {/* Logo */}
      <div className='flex items-center gap-[6px]'>
        <div className='relative w-[19.73px] h-[21.64px] sm:w-[29.59px] sm:h-[32.46px]'>
          <Image src='/icon/icon-logo.svg' alt='icon-logo' fill className='object-contain' />
        </div>
        <p className='text-[#0A0D12] text-base font-semibold'>Your Logo</p>
      </div>

      {/* Search Desktop */}
      <form
        onSubmit={handleSearch}
        className='hidden sm:flex items-center gap-2 w-[377px] h-[48px] rounded-2xl border border-[#D5D7DA] px-4 focus-within:border-[#181D27]'
      >
        <div className='w-[24px] h-[24px] relative'>
          <Image src='/icon/icon-search.svg' alt='icon-search' fill className='object-contain' />
        </div>
        <input
          type='text'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder='Search'
          className='text-sm font-normal text-[#717680] w-full outline-none border-none bg-transparent'
        />
      </form>

      {/* Mobile */}
      <div className='flex sm:hidden items-center gap-6'>

        {isLogin ? (
          <>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className='flex items-center gap-2 focus:outline-none'>
                  <Image src='/icon/icon-user.png' alt='icon-user' width={40} height={40} />
                </button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className='z-50 mt-2 min-w-[120px] rounded-md bg-white p-1 shadow-lg border border-gray-200'
                  sideOffset={8}
                >
                  <DropdownMenu.Item
                    className='text-sm px-3 py-2 hover:bg-gray-100 cursor-pointer rounded'
                    onSelect={() => router.push('/write-post')}
                  >
                    Write Post
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    className='text-sm px-3 py-2 hover:bg-gray-100 cursor-pointer rounded'
                    onSelect={() => router.push('/profile')}
                  >
                    Profil
                  </DropdownMenu.Item>

                  <DropdownMenu.Separator className='h-px bg-gray-200 my-1' />

                  <DropdownMenu.Item
                    className='text-sm px-3 py-2 text-red-500 hover:bg-gray-100 cursor-pointer rounded'
                    onSelect={() => setShowLogoutDialog(true)}
                  >
                    Logout
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </>
        ) : (
          <>

            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className='flex items-center gap-2 focus:outline-none'>
                  <Image src='/icon/icon-list-mobile.svg' alt='icon-list' width={24} height={24} />
                </button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className='z-50 mt-2 min-w-[120px] rounded-md bg-white p-1 shadow-lg border border-gray-200'
                  sideOffset={8}
                >
                  <DropdownMenu.Item
                    className='text-sm px-3 py-2 hover:bg-gray-100 cursor-pointer rounded'
                    onSelect={() => router.push('/login')}
                  >
                    Login
                  </DropdownMenu.Item>

                  <DropdownMenu.Separator className='h-px bg-gray-200 my-1' />

                  <DropdownMenu.Item
                    className='text-sm px-3 py-2 hover:bg-gray-100 cursor-pointer rounded'
                    onSelect={() => router.push('/register')}
                  >
                    Register
                  </DropdownMenu.Item>


                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </>
        )}
      </div>

      {/* Desktop User */}
      {isLogin ? (
        <div className='hidden sm:flex items-center gap-6'>
          <div className='flex items-center gap-[12px]'>
            <Image src='/icon/icon-pen.svg' alt='icon-pen' width={24} height={24} />
            <Link
              href='/write-post'
              className='text-[#0093DD] text-sm font-semibold underline underline-offset-3'
            >
              Write Post
            </Link>
          </div>
          <span className='text-[#D5D7DA] text-sm font-semibold'>|</span>

          {/* Dropdown */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className='flex items-center gap-2 focus:outline-none'>
                <Image src='/icon/icon-user.png' alt='icon-user' width={40} height={40} />
                <p className='text-[#181D27] text-sm font-medium'>{userName || 'User'}</p>
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className='z-50 mt-2 min-w-[120px] rounded-md bg-white p-1 shadow-lg border border-gray-200'
                sideOffset={8}
              >
                <DropdownMenu.Item
                  className='text-sm px-3 py-2 hover:bg-gray-100 cursor-pointer rounded'
                  onSelect={() => router.push('/profile')}
                >
                  Profil
                </DropdownMenu.Item>

                <DropdownMenu.Separator className='h-px bg-gray-200 my-1' />

                <DropdownMenu.Item
                  className='text-sm px-3 py-2 text-red-500 hover:bg-gray-100 cursor-pointer rounded'
                  onSelect={() => setShowLogoutDialog(true)}
                >
                  Logout
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>

          {/* Alert Dialog Logout */}
          <AlertDialog.Root open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
            <AlertDialog.Portal>
              <AlertDialog.Overlay className='fixed inset-0 bg-black/30 z-50' />
              <AlertDialog.Content className='fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-md shadow-lg max-w-[90vw] w-[320px]'>
                <AlertDialog.Title className='text-lg font-semibold mb-2'>Yakin mau logout?</AlertDialog.Title>
                <AlertDialog.Description className='text-sm text-gray-500 mb-4'>
                  Kamu akan keluar dari akun ini.
                </AlertDialog.Description>
                <div className='flex justify-end gap-4'>
                  <AlertDialog.Cancel asChild>
                    <button className='px-4 py-2 text-sm rounded bg-gray-200 hover:bg-gray-300'>
                      Batal
                    </button>
                  </AlertDialog.Cancel>
                  <AlertDialog.Action asChild>
                    <button
                      onClick={handleLogout}
                      className='px-4 py-2 text-sm rounded bg-red-500 text-white hover:bg-red-600'
                    >
                      Logout
                    </button>
                  </AlertDialog.Action>
                </div>
              </AlertDialog.Content>
            </AlertDialog.Portal>
          </AlertDialog.Root>
        </div>
      ) : (
        <div className='hidden sm:flex items-center gap-6'>
          <Link
            href='/login'
            className='text-[#0093DD] text-sm font-semibold underline underline-offset-3'
          >
            Login
          </Link>
          <span className='text-[#D5D7DA] text-sm font-semibold'>|</span>
          <Link
            href='/register'
            className='text-[#FDFDFD] text-sm font-semibold bg-[#0093DD] px-[64px] py-[8px] rounded-full'
          >
            Register
          </Link>
        </div>
      )}
    </div>
  );
};

export default Header;
